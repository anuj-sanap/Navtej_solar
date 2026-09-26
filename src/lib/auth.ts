import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "navtej_auth_token";

export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "owner";
  phone?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "navtej_solar_default_jwt_secret_change_in_production";

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecodeToBytes(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAuthToken(payload: AuthUserPayload): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const tokenPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = base64UrlEncodeBytes(new Uint8Array(signatureBuffer));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifyAuthToken(token: string): Promise<AuthUserPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signature = base64UrlDecodeToBytes(encodedSignature);

    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify("HMAC", key, signature as BufferSource, data);
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role || "user",
      phone: payload.phone,
    };
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function getAuthUserFromRequest(request: NextRequest | Request): Promise<AuthUserPayload | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token) return await verifyAuthToken(token);
    }
    if ("cookies" in request && typeof request.cookies.get === "function") {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) return await verifyAuthToken(token);
    }
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;
    const cookiesObj = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    const token = cookiesObj[AUTH_COOKIE_NAME];
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export function isOwnerUser(user: AuthUserPayload | null): boolean {
  if (!user) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || "sanapanuj7@gmail.com").toLowerCase();
  return user.role === "owner" || user.email.toLowerCase() === adminEmail;
}
