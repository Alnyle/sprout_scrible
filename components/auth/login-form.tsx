"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { emailSignIn } from '@/server/actions/email-singin';
import { useAction } from 'next-safe-action/hooks';
import { cn } from "@/lib/utils";
import FormSuccess from "./form-success";
import FormError from "./form-error";


const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if(data.data?.success) {
        setSuccess(data.data.success);
      }
      if(data.data?.error) {
        setError(data.data.error);
      }
    }
  });



  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values)
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {/*  email field */}
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="AhmedElniel.com" type="email" autoComplete="email"/>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password field */}
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="********" type="password" autoComplete="current-password"/>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success}/>
              <FormError message={error}/>
              <Button size={'sm'} variant={"link"} asChild>
                <Link href='/auth/reset'>Forgot your password</Link>
              </Button>
            </div>

            <Button type="submit" className={cn("w-full my-2", status == 'executing' ? 'animate-pulse' : "")}>{"Login"}</Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
