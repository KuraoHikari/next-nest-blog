"use server";

import * as z from "zod";

import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (
 values: z.infer<typeof ResetPasswordSchema>
) => {
 const validatedFields =
  ResetPasswordSchema.safeParse(values);

 if (!validatedFields.success) {
  return { error: "Invalid emaiL!" };
 }

 const { email } = validatedFields.data;

 const existingUser = await getUserByEmail(email);

 if (!existingUser) {
  return { error: "Email not found!" };
 }

 const passwordResetToken =
  await generatePasswordResetToken(email);
 await sendPasswordResetEmail(
  passwordResetToken.email,
  passwordResetToken.token
 );

 return { success: "Reset email sent!" };
};