'use server';


import { z } from "zod";
import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from 'next-safe-action';
import { db } from "..";
import { eq } from "drizzle-orm";
import { accounts } from "../schema";
import bcrypt from 'bcrypt';
import { users } from "../schema";
import { generateEmailVericiationToken } from "./tokens";
import { sendVericationEmail } from "./email";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient.schema(RegisterSchema).action(async ({ parsedInput: { email, password, name } }) => {


    // we are hashing our password
    const hashedPassword = await bcrypt.hash(password, 10);


    // check if user exist by query it's email
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    // checki if email is already in the database than say it's in use,
    // if it's not register the user but aslo send vericiation

    if (existingUser) {
        if (!existingUser.emailVerified) {
          const vericiationToken = await generateEmailVericiationToken(email);
          await sendVericationEmail(vericiationToken[0].email, vericiationToken[0].token)

          return { success: 'Email Confirmation reset' };
        }
        return { error: "Email already in use" }
    }

    // when user not registered => insert the new user in database
    await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
    });

    const vericiationToken = await generateEmailVericiationToken(email)

    await sendVericationEmail(vericiationToken[0].email, vericiationToken[0].token)

    return { success: "Confirmation Email Sent!" }

})

    

