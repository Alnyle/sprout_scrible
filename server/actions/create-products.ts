'use server';

import { ProductSchema } from '@/types/product-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();


export const createProduct = actionClient.schema(ProductSchema).action(async ({ parsedInput  : { title, description, price, id }}) => {

    try {
        // if the product id exist: it's mean we are in edit mode => editing existing product details
        if (id) {
            const currentProduct = await db.query.products.findFirst({
                where: eq(products.id, id),
            })

            // check if product exist by checking by id
            if (!currentProduct) return { error: "Product not found" }


            // update product details
            const newProduct = await db
                .update(products)
                .set({description, price, title})
                .where(eq(products.id, id)).returning();
            revalidatePath('/dashboard/products')
            return { success: `Product ${newProduct[0].title} has been updated` }
        }

        // if product id does not exist it's mean we are adding a new product
        if (!id) {
            const newProduct = await db
                .insert(products)
                .values({ description, price, title })
                .returning();

            revalidatePath('/dashboard/products')
            return { success: `Product ${newProduct[0].title} has been created` }
        }
    } catch(error) {
        return { error: JSON.stringify(error) }
    }

})