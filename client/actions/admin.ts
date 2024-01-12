"use server";

import { hashedPassword } from "@/data/pasword-api";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
 const role = await currentRole();

 const hash = await hashedPassword("12345");
 console.log(hash);

 if (role === UserRole.ADMIN) {
  return { success: "Allowed Server Action!" };
 }

 return { error: "Forbidden Server Action!" };
};
