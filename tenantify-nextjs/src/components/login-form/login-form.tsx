"use client";

import {
  useEffect,
  useState,
} from 'react';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { Spinner } from '../ui/spinner';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface LoginFormProps {
  logo: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ logo }) => {
  const [subdomain, setSubdomain] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      if (hostname === "localhost" || parts[parts.length - 1] === "localhost") {
        if (parts.length > 1) {
          // For cases like andi.localhost
          setSubdomain(parts[0]);
        }
      } else if (parts.length > 2) {
        // Assuming format is subdomain.domain.com
        setSubdomain(parts[0]);
      }
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    const adminBody = {
      redirect: false,
      identifier: data.username,
      password: data.password,
    };

    try {
      const signed: any = await signIn("admin-credentials", adminBody);
      setIsLoading(false);
      if (signed?.error) {
        toast({
          title: "Login failed. Please try again.",
        });
      } else if (signed?.ok) {
        toast({
          title: "Login successful!",
        });
        window.location.href = "/admin";
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: `"Unexpected error:", ${error}`,
      });
    }
    
    // if (subdomain) {
    //   const body = {
    //     redirect: false,
    //     username: data.username,
    //     password: data.password,
    //     domain: subdomain,
    //   };

    //   try {
    //     const signed: any = await signIn("credentials", body);
    //     setIsLoading(false);
    //     if (signed?.error) {
    //       toast({
    //         title: "Login failed. Please try again.",
    //       });
    //     } else if (signed?.ok) {
    //       toast({
    //         title: "Login successful!",
    //       });
    //       window.location.href = "/user";
    //     }
    //   } catch (error) {
    //     setIsLoading(false);
    //     toast({
    //       title: `"Unexpected error:", ${error}`,
    //     });
    //   }
    // } else {
    //   const adminBody = {
    //     redirect: false,
    //     identifier: data.username,
    //     password: data.password,
    //   };

    //   try {
    //     const signed: any = await signIn("admin-credentials", adminBody);
    //     setIsLoading(false);
    //     if (signed?.error) {
    //       toast({
    //         title: "Login failed. Please try again.",
    //       });
    //     } else if (signed?.ok) {
    //       toast({
    //         title: "Login successful!",
    //       });
    //       window.location.href = "/admin";
    //     }
    //   } catch (error) {
    //     setIsLoading(false);
    //     toast({
    //       title: `"Unexpected error:", ${error}`,
    //     });
    //   }
    // }
  };

  return (
    <div className="flex justify-center w-full h-screen items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/4 space-y-6"
        >
          {logo && subdomain && (
            <div className="flex justify-center">
              <Image src={logo} width={100} height={100} alt="logo" />
            </div>
          )}
          {!subdomain && (
            <div className="flex justify-center">
              <Image
                src={"/static/images/star.webp"}
                width={100}
                height={100}
                alt="logo"
              />
            </div>
          )}
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
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
              <span className={isLoading ? "ml-2" : ""}>Login</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
