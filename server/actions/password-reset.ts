'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import bcrypt from "bcrypt"
import { ResetSchema } from "@/types/reset-schema";
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './email';

const actionClient = createSafeActionClient();


export const reset = actionClient.schema(ResetSchema).action(async ({ parsedInput: { email } }) => {

    const existingUser = await db.query.users.findFirst({
        where: (eq(users.email, email))
    })

    if (!existingUser) {
        return { error: "User not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
        return { error: "Token not generated" }
    }

    await sendPasswordResetEmail(passwordResetToken.success[0].email, passwordResetToken.success[0].token)

    return { success: "Reset Email Sent" }
})