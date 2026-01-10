const CJ_BASE_URL = process.env.CJ_API_BASE_URL ?? "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_API_KEY = process.env.CJ_API_KEY;

// Cache the issued access token to avoid CJ's 1 call / 300 seconds limit on getAccessToken.
let cachedAccessToken: { token: string; expiresAt?: number } | null = null;

export interface CjProductRaw {
  productId?: string | number;
  id?: string | number;
  sku?: string | number;
  variantId?: string | number;
  productSku?: string | number;
  productName?: string;
  name?: string;
  nameEn?: string;
  title?: string;
  productTitle?: string;
  productDescription?: string;
  description?: string;
  shortDescription?: string;
  sellPrice?: number | string;
  price?: number | string;
  productPrice?: number | string;
  retailPrice?: number | string;
  discountPrice?: number | string;
  nowPrice?: number | string;
  bigImage?: string;
  categoryName?: string;
  categoryId?: string | number;
  category?: string | number;
  productImage?: string;
  mainImage?: string;
  image?: string;
  inventory?: number;
  stock?: number;
  warehouseInventoryNum?: number | string;
  deliveryTime?: number | string;
  shippingTime?: number | string;
  deliveryCycle?: number | string;
  storeName?: string;
  supplierName?: string;
  vendorName?: string;
  warehouseName?: string;
  shipFrom?: string;
  location?: string;
  rating?: number | string;
  score?: number | string;
}

export interface CjProductListResponse {
  data?: { list?: CjProductRaw[] } | CjProductRaw[];
  list?: CjProductRaw[];
}

export interface CjProductDetailResponse {
  data?: CjProductRaw | null;
  code?: number;
  message?: string;
}

async function ensureToken(): Promise<string | undefined> {
  if (!CJ_API_KEY) {
    console.warn("CJdropshipping API key is missing. Provide CJ_API_KEY.");
    return undefined;
  }

  const now = Date.now();
  if (cachedAccessToken?.token && (!cachedAccessToken.expiresAt || cachedAccessToken.expiresAt > now)) {
    return cachedAccessToken.token;
  }

  try {
    const response = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey: CJ_API_KEY }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Unable to sign in to CJdropshipping", await response.text());
      return undefined;
    }

    const payload = (await response.json()) as {
      data?: { accessToken?: string; expiresIn?: number; accessTokenExpiryDate?: string };
      code?: number;
      message?: string;
    };

    const token = payload?.data?.accessToken;
    if (!token) {
      console.warn("CJdropshipping auth missing token", payload?.message ?? "unknown error");
      return undefined;
    }

    const expiresAt = payload?.data?.accessTokenExpiryDate ? Date.parse(payload.data.accessTokenExpiryDate) : undefined;
    const expiresInMs = payload?.data?.expiresIn ? payload.data.expiresIn * 1000 : undefined;
    cachedAccessToken = {
      token,
      // Default to ~14 days if no TTL provided; spec says 15 days.
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : expiresInMs ? now + expiresInMs : now + 14 * 24 * 60 * 60 * 1000,
    };

    return token;
  } catch (error) {
    console.warn("CJdropshipping auth failed", error);
    return undefined;
  }
}

export interface CjProductFilters {
  keyword?: string;
  categoryId?: string;
  page?: number;
  size?: number;
}

export async function fetchCjProducts(filters: CjProductFilters = {}): Promise<CjProductListResponse | null> {
  const token = await ensureToken();

  if (!token) {
    return null;
  }

  const params = new URLSearchParams();
  if (filters.keyword) params.append("keyWord", filters.keyword);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  params.append("page", String(filters.page ?? 1));
  params.append("size", String(filters.size ?? 20));
  params.append("features", "enable_category,enable_description,enable_inventory");

  const response = await fetch(`${CJ_BASE_URL}/product/listV2?${params.toString()}`, {
    headers: {
      "CJ-Access-Token": token,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn("CJdropshipping products fetch failed", await response.text());
    return null;
  }

  return response.json();
}

export async function fetchCjProductById(id: string): Promise<CjProductDetailResponse | null> {
  const token = await ensureToken();

  if (!token) return null;

  const params = new URLSearchParams();
  params.append("pid", id);
  params.append("features", "enable_category,enable_description,enable_inventory");

  const response = await fetch(`${CJ_BASE_URL}/product/query?${params.toString()}`, {
    headers: {
      "CJ-Access-Token": token,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn("CJdropshipping product query failed", await response.text());
    return null;
  }

  return response.json();
}
