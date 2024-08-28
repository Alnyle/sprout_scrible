'use server';


import { z } from "zod";
import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVericiationToken } from "./tokens";
import { sendVericationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient.schema(LoginSchema).action(async ({ parsedInput: { email, password, code } }) => {


    try {

        // Check if the use is in the database
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser?.email !== email) {
            return { error: "Email not found" }
        }


        if (!existingUser.emailVerified) {
            const vericiationToken = await generateEmailVericiationToken(existingUser.email);
            await sendVericationEmail(vericiationToken[0].email, vericiationToken[0].token);
            return { success: "Confirmation Email Sent!" }
        }

        await signIn("credentials", {
            email,
            password,
            redirectTo: '/',
        })

        return { success: email }
    } catch(error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch(error.type) {
                case "CredentialsSignin": 
                    return { error: "Email or password Incorrect" }
                case "AccessDenied":
                    return { error: error.message };
                case "OAuthSignInError":
                    return { error: error.message };
                default:
                    return  { error: "Something went wrong!" }
            }
        }
        throw error
    }

})

    

