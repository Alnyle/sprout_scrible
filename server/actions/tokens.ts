'use server';

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens } from "../schema";
import { users } from "../schema";

// query database if exist if not it will return null
const getVericiationTokenByEmail = async (email: string) => {
    try {
         
        // check if the user has already token
        const vericiationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, email),
        })

        return vericiationToken;

    } catch(error) {
        return { error: null }
    }
} 

// It will generate a token for every email
export const generateEmailVericiationToken = async (email: string) => {

    // generater from the token
    const token = crypto.randomUUID();

    // generate expires date which is after 36 hours
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVericiationTokenByEmail(email)

    // if user has already token delete the old one
    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
    }

    const vericiationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires,
    }).returning();

    return vericiationToken;
}


export const newVerification = async (token: string) => {

    const existingToken = await getVericiationTokenByEmail(token);

    if (!existingToken) return { error: "Token not found" }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) return { error: "Token has expired" };

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })

    if (!existingUser) return { error: "Email does not exist" }
    
    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email,
    })

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))


    return { success: "Email Verified" }

}