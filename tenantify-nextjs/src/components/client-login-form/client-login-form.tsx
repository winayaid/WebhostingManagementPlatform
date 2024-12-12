"use client";

import { useEffect, useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { Spinner } from "../ui/spinner";

// Updated schema to include password validation
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const ClientLoginForm = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Use useEffect to safely access window and extract the domain
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.hostname.split(".")[0]);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const body = {
      redirect: false,
      username: data.username,
      password: data.password,
      domain: domain,
    };

    try {
      const signed: any = await signIn("credentials", body);
      setIsLoading(false);
      if (signed?.error) {
        toast({
          title: "Login failed. Please try again.",
        });
      } else if (signed?.ok) {
        toast({
          title: "Login successful!",
        });
        window.location.href = "/user-dashboard";
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: `"Unexpected error:", ${error}`,
      });
    }
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  return (
    <div className="flex justify-center w-full h-screen items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/4 space-y-6"
        >
          <div className="flex justify-center">
            <Image
              src="/static/images/star.webp"
              width={100}
              height={100}
              alt="logo"
            />
          </div>
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a strong password with at least 6 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500"
            >
              {isLoading && <Spinner />}
              <span className={isLoading ? "ml-2" : ""}>Submit</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
