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
}

const MAX_PAGE_SIZE = 60;
const MAX_PAGES = 3;

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

  const dataValue = response.data;
  if (Array.isArray(dataValue)) return dataValue;
  if (Array.isArray(dataValue?.list)) return dataValue.list;
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
    const desired = options.limit ?? 60;
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(12, desired));
    const pages = Math.min(MAX_PAGES, Math.max(1, options.pages ?? Math.ceil(desired / pageSize)));

    const pagePromises = Array.from({ length: pages }, (_, index) => {
      const filters: CjProductFilters = {
        keyword: options.keyword,
        categoryId: options.category,
        page: index + 1,
        size: pageSize,
      };
      return fetchCjProducts(filters);
    });

    const responses = await Promise.all(pagePromises);
    const combinedRaw = dedupeProducts(
      responses.flatMap((response) => extractCjList(response))
    );

    const normalized = shuffle(
      combinedRaw.map((item) => normalizeCjProduct(item)).filter(Boolean) as Product[]
    );

    const filtered = options.category
      ? normalized.filter((product) => product.category?.toLowerCase() === options.category?.toLowerCase())
      : normalized;

    const minimum = options.limit ?? 24;
    let filled = filtered;

    if (filled.length < minimum) {
      const extras = buildFallback(options, minimum).filter(
        (product) => !filled.some((p) => p.id === product.id)
      );
      filled = [...filled, ...extras].slice(0, minimum);
    }

    const sliced = options.limit ? filled.slice(0, options.limit) : filled;

    if (sliced.length > 0) return sliced;
  } catch (error) {
    console.warn("CJdropshipping fetch failed; falling back to mock data", error);
  }

  const fallback = buildFallback(options, 12);
  return fallback;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find((product) => product.id === id);
  if (found) return found;

  const mock = mockProducts.find((product) => product.id === id);
  return mock ?? null;
}
