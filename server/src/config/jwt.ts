import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export const JWT_SECRET = (process.env.JWT_SECRET ?? "dev-secret-change-me") as Secret;
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
export const JWT_EXPIRES_LABEL = process.env.JWT_EXPIRES_IN ?? "7d";

export type JwtPayload = {
  userId: string;
};

export function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
