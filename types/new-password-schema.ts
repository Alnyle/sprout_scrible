import * as z from 'zod';


export const NewPasswrodSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    token: z.string().nullable().optional(),
})