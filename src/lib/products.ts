import { fetchCjProducts, type CjProductFilters, type CjProductListResponse, type CjProductRaw } from "./cj";
import { mockProducts } from "@/data/mockData";
import { type Product } from "@/types/product";

const placeholderImage =
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

interface GetProductsOptions {
  category?: string;
  limit?: number;
  keyword?: string;
  pages?: number;
  maxPrice?: number; // optional cap to favor cheaper products
}

// CJ listV2 allows size up to 100; fetch more pages when available.
const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 30;

function normalizedId(item: CjProductRaw | null | undefined): string {
  if (!item) return "";
  return String(item.productId ?? item.id ?? item.sku ?? item.variantId ?? item.productSku ?? "").trim();
}

function normalizeCjProduct(item: CjProductRaw | null | undefined): Product | null {
  if (!item) return null;

  const id = String(item.productId ?? item.id ?? item.sku ?? item.variantId ?? item.productSku ?? "");
  const title = item.productName ?? item.name ?? item.title ?? item.productTitle ?? "Untitled product";
  const description =
    item.productDescription ?? item.description ?? item.shortDescription ?? "CJdropshipping product";
  const rawPrice =
    Number(item.sellPrice ?? item.price ?? item.productPrice ?? item.retailPrice ?? item.discountPrice ?? 0);
  const price = Number.isFinite(rawPrice) && rawPrice > 0 ? Math.round(rawPrice) : 25000;
  const category =
    item.categoryName ??
    (item.categoryId ? String(item.categoryId) : undefined) ??
    (item.category ? String(item.category) : "general");
  const image = item.productImage ?? item.mainImage ?? item.image ?? placeholderImage;
  const stock = Number.isFinite(item.inventory) ? Number(item.inventory) : Number(item.stock ?? 50);
  const shippingTimeInDays = Number(item.deliveryTime ?? item.shippingTime ?? 7);
  const sellerName = item.storeName ?? item.supplierName ?? item.vendorName ?? "CJ Supplier";
  const sellerLocation = item.warehouseName ?? item.shipFrom ?? item.location ?? "CJ Warehouse";
  const rating = Number(item.rating ?? item.score ?? 4.6);

  return {
    id: id || title,
    title,
    description,
    price,
    category,
    image,
    rating: Number.isFinite(rating) ? rating : 4.6,
    seller: {
      name: sellerName,
      location: sellerLocation,
    },
    stock: Number.isFinite(stock) ? stock : 50,
    shippingTimeInDays,
  } satisfies Product;
}

function extractCjList(response: CjProductListResponse | null): CjProductRaw[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  // API 2.0 listV2: data.content[0].productList holds the items.
  const content = (response as any)?.data?.content;
  if (Array.isArray(content) && content.length > 0) {
    const productList = content[0]?.productList;
    if (Array.isArray(productList)) return productList;
  }

  const dataValue = response.data;
  if (Array.isArray(dataValue)) return dataValue;
  if (Array.isArray((dataValue as any)?.list)) return (dataValue as any).list;
  if (Array.isArray(response.list)) return response.list;

  return [];
}

function dedupeProducts(list: CjProductRaw[]): CjProductRaw[] {
  const seen = new Set<string>();
  const result: CjProductRaw[] = [];

  for (const item of list) {
    const id = normalizedId(item);
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(item);
  }

  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sortByPriceAscending(list: Product[]): Product[] {
  return [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
}

function buildFallback(options: GetProductsOptions, minimum: number): Product[] {
  const base = options.category
    ? mockProducts.filter((product) => product.category === options.category)
    : mockProducts;

  if (base.length >= minimum) {
    return options.limit ? base.slice(0, options.limit) : base;
  }

  // If we need more items for a category, clone other mock products into the requested category.
  const extras = mockProducts
    .filter((product) => product.category !== options.category)
    .map((product, index) => ({
      ...product,
      id: `${options.category ?? "general"}-fallback-${index}-${product.id}`,
      category: options.category ?? product.category,
      title: `${product.title} (${options.category ?? "featured"})`,
    }));

  const combined = [...base, ...extras];
  return options.limit ? combined.slice(0, options.limit) : combined;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    const desired = options.limit ?? 120;
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(20, desired));

    // First page to discover total pages, then fetch remaining up to MAX_PAGES.
    const firstResponse = await fetchCjProducts({
      keyword: options.keyword,
      categoryId: options.category,
      page: 1,
      size: pageSize,
    });

    const firstPageList = extractCjList(firstResponse);
    const totalPages = Math.min(
      MAX_PAGES,
      Math.max(
        1,
        Number((firstResponse as any)?.data?.totalPages ?? (firstResponse as any)?.totalPages ?? 1)
      )
    );

    const remainingPages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);

    const remainingResponses = await Promise.all(
      remainingPages.map((page) =>
        fetchCjProducts({
          keyword: options.keyword,
          categoryId: options.category,
          page,
          size: pageSize,
        })
      )
    );

    const combinedRaw = dedupeProducts(
      [firstPageList, ...remainingResponses.map((response) => extractCjList(response))].flat()
    );

    const normalized = shuffle(
      combinedRaw.map((item) => normalizeCjProduct(item)).filter(Boolean) as Product[]
    );

    const byCategory = options.category
      ? normalized.filter((product) => product.category?.toLowerCase() === options.category?.toLowerCase())
      : normalized;

    const byPrice = options.maxPrice
      ? byCategory.filter((product) => Number.isFinite(product.price) && product.price <= options.maxPrice!)
      : byCategory;

    // Prefer cheaper items when requested.
    const filtered = options.maxPrice ? byPrice : byCategory;

    const minimum = options.limit ?? filtered.length;
    const prioritized = options.maxPrice ? sortByPriceAscending(filtered) : filtered;
    const sliced = options.limit ? prioritized.slice(0, options.limit) : prioritized;

    if (sliced.length > 0) return sliced;
  } catch (error) {
    console.warn("CJdropshipping fetch failed; falling back to mock data", error);
  }

  // Do not fabricate items; return empty on failure.
  return [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find((product) => product.id === id);
  if (found) return found;

  const mock = mockProducts.find((product) => product.id === id);
  return mock ?? null;
}
