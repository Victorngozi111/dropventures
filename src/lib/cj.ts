const CJ_BASE_URL = process.env.CJ_API_BASE_URL ?? "https://developers.cjdropshipping.com/api/v2";
const CJ_EMAIL = process.env.CJ_API_EMAIL;
const CJ_PASSWORD = process.env.CJ_API_PASSWORD;
const CJ_API_KEY = process.env.CJ_API_KEY;

interface CjAuthResponse {
  data: {
    token: string;
  };
}

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
  if (!CJ_API_KEY && (!CJ_EMAIL || !CJ_PASSWORD)) {
    console.warn("CJdropshipping credentials are missing. Falling back to mock data.");
    return undefined;
  }

  if (CJ_API_KEY) {
    return CJ_API_KEY;
  }

  try {
    const response = await fetch(`${CJ_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: CJ_EMAIL, password: CJ_PASSWORD }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Unable to sign in to CJdropshipping", await response.text());
      return undefined;
    }

    const payload = (await response.json()) as CjAuthResponse;
    return payload.data.token;
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
  if (filters.keyword) params.append("keyword", filters.keyword);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  params.append("page", String(filters.page ?? 1));
  params.append("size", String(filters.size ?? 20));

  const response = await fetch(`${CJ_BASE_URL}/product/list?${params.toString()}`, {
    headers: {
      Authorization: token,
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
