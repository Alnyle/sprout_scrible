'use server';

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, passwordResetTokens, twoFactorTokens } from "../schema";
import { users } from "../schema";
import crypto from "crypto";

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


// 
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

export const getPasswordResetTokenByToken = async (token: string) => {

    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        })
        return passwordResetToken
    } catch(error) {
        return null
    }
}


export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        })
        return passwordResetToken
    } catch(error) {
        return null
    }
}


// generate token by using email if there a token for this delete it and generate new one
export const generatePasswordResetToken = async (email: string) => {


    try {

        // generater from the token
        const token = crypto.randomUUID();

        // generate expires date which is after 36 hours
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getPasswordResetTokenByEmail(email);

        if (existingToken) {
            await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.id, existingToken.id))
        }

        const passwordResetToken = await db.insert(passwordResetTokens).values({
            email,
            token,
            expires,  
        }).returning();
        return { success: passwordResetToken }
    } catch(error) {
        return null
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        })
        return twoFactorToken
    } catch(error) {
        return null
    }
}


export const getTwoFactorTokenByToken = async (token: string) => {

    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        })
        return twoFactorToken
    } catch(error) {
        return null
    }
}



// generate token by using email if there a token for this delete it and generate new one
export const generateTwoFactorToken = async (email: string) => {


    try {

        // generater from the token
        const token = crypto.randomInt(100_000, 1_000_000).toString();

        // generate expires date which is after 36 hours
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getTwoFactorTokenByEmail(email);

        if (existingToken) {
            await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, existingToken.id))
        }

        const twoFactorToken = await db.insert(twoFactorTokens).values({
            email,
            token,
            expires,  
        }).returning();
        return twoFactorToken
    } catch(error) {
        return null
    }
}