'use server';


import { z } from "zod";
import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient.schema(LoginSchema).action(async ({ parsedInput: { email, password, code } }) => {
    // Check if the use is in the database

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    if (existingUser?.email !== email) {
        return { error: "Email not found" }
    }

    // if (!existingUser?.emailVerified) {

    // }
    console.log(email, password, code)

    return { success: email }

})

    

