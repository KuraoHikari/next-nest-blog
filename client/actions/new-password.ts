"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { hashedPassword } from "@/data/pasword-api";

export const newPassword = async (
 values: z.infer<typeof NewPasswordSchema>,
 token?: string | null
) => {
 if (!token) {
  return { error: "Missing token!" };
 }

 const validatedFields =
  NewPasswordSchema.safeParse(values);

 if (!validatedFields.success) {
  return { error: "Invalid fields!" };
 }

 const { password } = validatedFields.data;

 const existingToken = await getPasswordResetTokenByToken(
  token
 );

 if (!existingToken) {
  return { error: "Invalid token!" };
 }

 const hasExpired =
  new Date(existingToken.expires) < new Date();

 if (hasExpired) {
  return { error: "Token has expired!" };
 }

 const existingUser = await getUserByEmail(
  existingToken.email
 );

 if (!existingUser) {
  return { error: "Email does not exist!" };
 }

 const hash = await hashedPassword(password);

 if (!hash) {
  return { error: "Invalid Credentials" };
 }

 await db.user.update({
  where: { id: existingUser.id },
  data: { password: hash },
 });

 await db.passwordResetToken.delete({
  where: { id: existingToken.id },
 });

 return { success: "Password updated!" };
};
