const CJ_BASE_URL = process.env.CJ_API_BASE_URL ?? "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_EMAIL = process.env.CJ_API_EMAIL;
const CJ_PASSWORD = process.env.CJ_API_PASSWORD;
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
  categoryName?: string;
  categoryId?: string | number;
  category?: string | number;
  productImage?: string;
  mainImage?: string;
  image?: string;
  inventory?: number;
  stock?: number;
  deliveryTime?: number | string;
  shippingTime?: number | string;
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

async function ensureToken(): Promise<string | undefined> {
  if (!CJ_EMAIL || !CJ_PASSWORD) {
    console.warn("CJdropshipping credentials are missing. Provide CJ_API_EMAIL and CJ_API_PASSWORD.");
    return CJ_API_KEY; // Fallback to legacy key if present, though it may be rejected by API 2.0.
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
      body: JSON.stringify({ email: CJ_EMAIL, password: CJ_PASSWORD }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Unable to sign in to CJdropshipping", await response.text());
      return CJ_API_KEY;
    }

    const payload = (await response.json()) as {
      data?: { accessToken?: string; expiresIn?: number };
      code?: number;
      message?: string;
    };

    const token = payload?.data?.accessToken;
    if (!token) {
      console.warn("CJdropshipping auth missing token", payload?.message ?? "unknown error");
      return CJ_API_KEY;
    }

    const expiresInMs = payload?.data?.expiresIn ? payload.data.expiresIn * 1000 : undefined;
    cachedAccessToken = {
      token,
      // Default to 4 minutes if no TTL provided to respect 300s rate-limit window.
      expiresAt: expiresInMs ? now + expiresInMs : now + 4 * 60 * 1000,
    };

    return token;
  } catch (error) {
    console.warn("CJdropshipping auth failed", error);
    return CJ_API_KEY;
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
