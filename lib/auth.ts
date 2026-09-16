import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin-token");

  if (!token?.value || !JWT_SECRET) {
    return false;
  }

  try {
    await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
