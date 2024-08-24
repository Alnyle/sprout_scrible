import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="text-special bg-white flex justify-between px-12 py-4">
      <h1>HomePage</h1>
      <Button variant={"default"}>Click here</Button>
    </main>
  );
}
