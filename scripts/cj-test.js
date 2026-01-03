/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Load environment from .env.local first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const CJ_BASE_URL = process.env.CJ_API_BASE_URL || "https://developers.cjdropshipping.com/api2.0/v1";
const CJ_API_KEY = process.env.CJ_API_KEY;
const TOKEN_CACHE_PATH = path.join(__dirname, ".cj-token.json");

if (!CJ_API_KEY) {
  console.error("Missing CJ API key. Set CJ_API_KEY in .env.local");
  process.exit(1);
}

async function ensureFetch() {
  if (typeof fetch !== "undefined") return fetch;
  const { default: nodeFetch } = await import("node-fetch");
  return nodeFetch;
}

function loadCachedToken() {
  try {
    const raw = fs.readFileSync(TOKEN_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed?.accessToken && parsed?.accessTokenExpiryDate) {
      const expiresAt = Date.parse(parsed.accessTokenExpiryDate);
      if (Number.isFinite(expiresAt) && expiresAt > Date.now() + 60_000) {
        return parsed.accessToken;
      }
    }
  } catch {
    // ignore cache miss
  }
  return null;
}

function saveToken(payload) {
  try {
    fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(payload, null, 2));
  } catch (error) {
    console.warn("Unable to write token cache", error);
  }
}

async function getToken(doFetch) {
  const cached = loadCachedToken();
  if (cached) return cached;

  const res = await doFetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CJ auth failed ${res.status}: ${text}`);
  }

  const json = await res.json();
  const token = json?.data?.accessToken;
  const accessTokenExpiryDate = json?.data?.accessTokenExpiryDate;
  if (!token) {
    throw new Error(`CJ auth missing accessToken: ${JSON.stringify(json)}`);
  }
  saveToken({ accessToken: token, accessTokenExpiryDate });
  return token;
}

async function getProducts(doFetch, token) {
  const params = new URLSearchParams({ page: "1", size: "5" });
  const res = await doFetch(`${CJ_BASE_URL}/product/listV2?${params.toString()}`, {
    headers: { "CJ-Access-Token": token },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CJ product list failed ${res.status}: ${text}`);
  }

  const json = await res.json();
  const list = Array.isArray(json?.data?.list)
    ? json.data.list
    : Array.isArray(json?.data?.content)
      ? json.data.content.flatMap((item) => item?.productList || [])
      : json?.list || [];
  return { json, list };
}

(async () => {
  const doFetch = await ensureFetch();
  const token = await getToken(doFetch);
  const { list } = await getProducts(doFetch, token);
  console.log(`Fetched ${list.length} products (showing up to 5):`);
  console.log(JSON.stringify(list.slice(0, 5), null, 2));
  // Optionally inspect the full payload shape
  // console.log(JSON.stringify(json, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
