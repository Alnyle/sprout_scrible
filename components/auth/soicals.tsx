'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle,   } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


const Socials = () => {
  return (
    <div className="flex flex-col items-center w-full gap-2">
        <Button
          variant={"outline"}
          className="flex gap-4 w-full"   
          onClick={() => signIn('google', {
            redirect: false,
            callbackUrl: '/',
        })}>
            <p>Sign in with Google</p>
            {/* <FcGoogle className'w-4'/> */}
            <FcGoogle className="w-4 h-4"/>
        </Button>

        <Button
          variant={"outline"}  
          className="flex gap-4 w-full"   
          onClick={() => signIn('github', {
            redirect: false,
            callbackUrl: '/'
        })}>
            <p>Sign in with GitHub</p>
            <FaGithub className="w-4 h-4"/>
        </Button>
    </div>
  )
}

export default Socials