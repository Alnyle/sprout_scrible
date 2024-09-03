"use client";

import { useForm } from "react-hook-form";
import { ProductSchema, zProductSchema } from "@/types/product-schema";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-products";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";

const ProductForm = () => {

  
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const router = useRouter();
  const searchProduct = useSearchParams();
  const editMode = searchProduct.get("id");


  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data.error) {
        toast.error(error);
        router.push('/dashboard/products');
        return;
      }

      if (data.success) {
        const id = parseInt(editMode);
        form.setValue("title", data.success.title)
        form.setValue("description", data.success.description)
        form.setValue("price", data.success.price)
        form.setValue("id", id)
      }
      
    }
  }


  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode))
    }

  }, [])



  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        router.push("/dashboard/products")
        toast.success(data.data?.success);
      }
      if (data.data?.error) {
        toast.error(data.data?.error);
      }
    },
    onExecute: (data) => {
      if (editMode) {
        toast.loading("Editing Product")
      } 
      if (!editMode) {
        toast.loading("Creating Product")
      }
    }

  })

  async function onSubmit(values: zProductSchema) {
    execute(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editMode ? "Edit product" : "Create Product"}
        </CardTitle>
        <CardDescription>
          {editMode
          ? "Make changes to existing product"
          : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input placeholder="Your price in USD" type="number" {...field} step="0.1" min={0}/> 
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty } 
              className="w-full">
                {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
