'use server';


import { z } from "zod";
import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import { generateEmailVericiationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens";
import { sendTwoFactorTokenByEmail, sendVericationEmail } from "./email";
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



        if (existingUser.twoFactorEnabled && existingUser.email) {
            if (code) {
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

                if (!twoFactorToken) {
                    return { error: "Invalid Token" };
                }
    
                if (twoFactorToken.token !== code) {
                    return { error: 'Invalid Token' }
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date();

                if (hasExpired) {
                    return { error: "Token has expired" }
                }

                await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id));
                
                const existingConfirmation = await getTwoFactorTokenByEmail(existingUser.email);
                if (existingConfirmation) {
                    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, existingUser.email))
                }
            } else {
                // generate two factor token
                const token = await generateTwoFactorToken(existingUser.email);
                if (!token) {
                    return { error: "Token not generate" }
                }
                await sendTwoFactorTokenByEmail(token[0]?.email, token[0]?.token);
                return { twoFactor: "Two Factor token sent!" }
            }
    
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

    

