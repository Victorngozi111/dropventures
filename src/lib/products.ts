import {
  fetchCjProductById,
  fetchCjProducts,
  type CjProductDetailResponse,
  type CjProductListResponse,
  type CjProductRaw,
} from "./cj";
import { type Product } from "@/types/product";

const placeholderImage =
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

const defaultUsdToNgnRate = Number(
  process.env.NGN_PER_USD ?? process.env.NEXT_PUBLIC_NGN_PER_USD ?? 1600
);

interface GetProductsOptions {
  category?: string;
  limit?: number;
  keyword?: string;
  pages?: number;
  maxPrice?: number; // optional cap to favor cheaper products
}

type CjListV2Data = {
  content?: Array<{ productList?: CjProductRaw[]; totalPages?: number }>;
  totalPages?: number;
};

type CjListV2Response = CjProductListResponse & {
  data?: CjListV2Data;
  totalPages?: number;
};

// CJ listV2 allows size up to 100; fetch more pages when available.
const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 3;
const PRODUCT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CachedProducts = {
  expiresAt: number;
  items: Product[];
};

const productCache = new Map<string, CachedProducts>();

function cacheKey(options: GetProductsOptions): string {
  return JSON.stringify({
    keyword: options.keyword ?? null,
    category: options.category ?? null,
    maxPrice: options.maxPrice ?? null,
    limit: options.limit ?? null,
  });
}

function parsePrice(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const firstNumberMatch = String(value).match(/\d+(?:\.\d+)?/);
  if (!firstNumberMatch) return null;
  const parsed = parseFloat(firstNumberMatch[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedId(item: CjProductRaw | null | undefined): string {
  if (!item) return "";
  return String(item.productId ?? item.id ?? item.sku ?? item.variantId ?? item.productSku ?? "").trim();
}

function normalizeCjProduct(item: CjProductRaw | null | undefined): Product | null {
  if (!item) return null;

  const id = String(item.productId ?? item.id ?? item.sku ?? item.variantId ?? item.productSku ?? "");
  const title =
    item.productName ?? item.name ?? item.nameEn ?? item.title ?? item.productTitle ?? "Untitled product";
  const description =
    item.productDescription ?? item.description ?? item.shortDescription ?? "CJdropshipping product";
  const rawPriceUsd =
    parsePrice(item.sellPrice) ??
    parsePrice(item.nowPrice) ??
    parsePrice(item.price) ??
    parsePrice(item.productPrice) ??
    parsePrice(item.retailPrice) ??
    parsePrice(item.discountPrice) ??
    null;
  const usdPrice = rawPriceUsd !== null && Number.isFinite(rawPriceUsd) && rawPriceUsd > 0 ? rawPriceUsd : 12;
  const exchangeRate = Number.isFinite(defaultUsdToNgnRate) && defaultUsdToNgnRate > 0 ? defaultUsdToNgnRate : 1600;
  const price = Math.max(500, Math.round(usdPrice * exchangeRate));
  const category =
    item.categoryName ??
    (item.categoryId ? String(item.categoryId) : undefined) ??
    (item.category ? String(item.category) : "general");
  const image = item.bigImage ?? item.productImage ?? item.mainImage ?? item.image ?? placeholderImage;
  const stock = Number.isFinite(item.inventory)
    ? Number(item.inventory)
    : Number.isFinite(Number(item.warehouseInventoryNum))
      ? Number(item.warehouseInventoryNum)
      : Number.isFinite(Number(item.stock))
        ? Number(item.stock)
        : 50;
  const shippingTimeInDays = (() => {
    const cycle = item.deliveryCycle ?? item.deliveryTime ?? item.shippingTime;
    if (typeof cycle === "string") {
      const match = cycle.match(/\d+/);
      if (match) return Number(match[0]);
    }
    const numeric = Number(cycle);
    return Number.isFinite(numeric) ? numeric : 7;
  })();
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
  const data = (response as CjListV2Response).data;
  const content = data?.content;
  if (Array.isArray(content) && content.length > 0) {
    const productList = content[0]?.productList ?? [];
    if (Array.isArray(productList)) return productList;
  }

  const dataValue = response.data;
  if (Array.isArray(dataValue)) return dataValue;
  const listValue = (dataValue as CjProductListResponse | undefined)?.list;
  if (Array.isArray(listValue)) return listValue;
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

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const key = cacheKey(options);
  const now = Date.now();
  const cached = productCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.items;
  }

  try {
    const desired = options.limit ?? 120;
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(20, desired));
    const pagesToFetch = Math.min(MAX_PAGES, Math.max(1, Math.ceil(desired / pageSize)));

    const pages = Array.from({ length: pagesToFetch }, (_, index) => index + 1);

    const responses = await Promise.all(
      pages.map((page) =>
        fetchCjProducts({
          keyword: options.keyword,
          categoryId: options.category,
          page,
          size: pageSize,
        })
      )
    );

    const combinedRaw = dedupeProducts(responses.flatMap((response) => extractCjList(response)));

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

    const prioritized = options.maxPrice ? sortByPriceAscending(filtered) : filtered;
    const sliced = options.limit ? prioritized.slice(0, options.limit) : prioritized;

    if (sliced.length > 0) {
      productCache.set(key, { expiresAt: now + PRODUCT_CACHE_TTL_MS, items: sliced });
      return sliced;
    }
  } catch (error) {
    console.warn("CJdropshipping fetch failed; falling back to mock data", error);
  }

  // Do not fabricate items; return empty on failure.
  return [];
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetchCjProductById(id);
    const payload = response as CjProductDetailResponse | null;
    const normalized = normalizeCjProduct(payload?.data);
    if (normalized) return normalized;
  } catch (error) {
    console.warn("CJdropshipping product detail fetch failed", error);
  }

  const products = await getProducts({ limit: 50 });
  return products.find((product) => product.id === id) ?? null;
}
