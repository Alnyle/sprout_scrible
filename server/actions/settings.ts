'use server';

import { string, z } from "zod";
import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVericiationToken } from "./tokens";
import { sendVericationEmail } from "./email";
import { auth, signIn } from "../auth";
import { AuthError } from "next-auth";
import { SettingsSchema } from "@/types/setting-schema";
import bcrypt from 'bcrypt';
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();


export const settings = actionClient.schema(SettingsSchema).action(async ({ parsedInput }) => {


    // check if the user login
    const user = await auth();
    if (!user) {
        return {error: "User not found"};
    }

    // check if the if 
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id)
    })

    if (!dbUser) {
        return { error: "User not found" };
    }

    // check is two Factor enabled => authenticate through google or github
    if (user.user.isOAuth) {
        parsedInput.email = undefined;
        parsedInput.password = undefined;
        parsedInput.newPassword = undefined;
        parsedInput.isTwoFactorEnabled = undefined;
    }

    // check if passowrd exist in parsed input
    if (parsedInput.password && parsedInput.newPassword && dbUser.password) {

        // check the if the old password match current password user send
        const passwordMatch = await bcrypt.compare(parsedInput.password, dbUser.password);

        // if not the same return errror message
        if (!passwordMatch) {
            return { error: "Password does not match" }
        }

        // if new password match old password send message error
        const samePassword = await bcrypt.compare(parsedInput.newPassword, dbUser.password);
        if (samePassword) {
            return { error: "New password is the same as the old password" };
        }

        // hash the new password and make it as new password 
        const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10);
        parsedInput.password = hashedPassword;
        parsedInput.newPassword = undefined;
    }

    // update user info
    const updateUser = await db.update(users).set({
        twoFactorEnabled: parsedInput.isTwoFactorEnabled,
        name: parsedInput.name,
        email: parsedInput.email,
        password: parsedInput.password,
        image: parsedInput.image,
    }).where(eq(users.id, dbUser.id)).returning()

    revalidatePath('/dashboard/settings')
    return { success: "settings updated" }




})