'use server';


import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

// delete product by Id
export const deleteProduct = actionClient.schema(z.object({ id: z.number() })).action(async ( {parsedInput: { id }} ) => {

    try {

        // query product by id
        const data = await db
            .delete(products)
            .where(eq(products.id, id)).returning();


        // revalidate the path by refetch from the server
        revalidatePath('/dashboard/products');
        // reuturn success message
        return { success: `Product ${data[0].title} has been deleted` }



    } catch(error) {
        return { error: "Id invalid" }

    }
    
})