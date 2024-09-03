"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";


type ProductColumn = {
    title: string
    price: number
    image: string
    variants: any
    id: number
}


async function deleteProductWrapper(id: number) {

    const result = await deleteProduct({ id });

    if (result?.data) {
        
        const { data } = result;
        
        if (!data) {
            return new Error("No data found")
        }

        if (data?.success) {
            toast.success(data.success);
        }
        if (data?.error) {
            toast.error(data.error)
        }
    }

}

const actionCell = ({row}: { row: Row<ProductColumn> }) => {
    const { status, execute } = useAction(deleteProduct ,{
        onSuccess: (data) => {
            if (data.data?.success) {
                toast.success(data.data.success);
            }

            if (data.data?.error) {
                toast.error(data.data.error);
            }
        },
        onExecute: () => {
            toast.loading("Deleting Product")
        }

    })

    const product = row.original

    return (
        <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
            <Button className="size-8 p-0">
                <MoreHorizontal className="size-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
          className="dark:focus:bg-primary
          focus:bg-primary/50 cursor-point"
          >
            <Link href={`/dashboard/add-products?id=${product.id}`}>
                Edit Product
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
          className="dark:focus:bg-destructive
          focus:bg-destructive/50 cursor-pointer" onClick={() => execute({ id:product.id})}>Delete Product</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> 
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "variants",
        header: "Variants",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({row}) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency",
            }).format(price);
            return (<div className="font-medium text-sm">
                {formatted}
            </div>)
        }
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({row}) => {
            const cellImage = row.getValue("image") as string;
            const cellTitle = row.getValue("title") as string;
            return (
                <div className="">
                    <Image 
                        src={cellImage} 
                        alt={cellTitle} 
                        width={50} 
                        height={50}
                        className="rounded-md"
                        />
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: actionCell,
    }

]
