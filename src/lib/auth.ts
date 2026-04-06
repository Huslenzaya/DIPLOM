import { JwtPayload, sign, verify } from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "galigtan_auth";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-galigtan-secret";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
}

export function createJwt(payload: { userId: string }) {
  return sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyJwt(token: string) {
  return verify(token, JWT_SECRET) as AuthTokenPayload;
}
