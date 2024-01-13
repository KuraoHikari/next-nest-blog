import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
 role: UserRole;
 isTwoFactorEnabled: boolean;
 isOAuth: boolean;
 nestApiToken: string;
 nestApiExpires: number;
};

declare module "next-auth" {
 interface Session {
  user: ExtendedUser;
  nestApiToken: string;
  nestApiExpires: number;
 }
}
