import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import ProductForm from "./product-form";


const AddProducts = async () => {

  const session = await auth();

  if (session?.user.role !== "admin") return redirect('/dashboard/settings');

  return <ProductForm/>
}

export default AddProducts;