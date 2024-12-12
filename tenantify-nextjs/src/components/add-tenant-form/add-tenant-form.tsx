"use client";

import { useEffect, useState } from "react";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import api from "@/services/api";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { Spinner } from "../ui/spinner";

// Updated schema to include new fields
const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Tenant Name must be at least 2 characters." }),
  domain: z
    .string()
    .min(2, { message: "Domain must be at least 2 characters." })
    .regex(/^[^\s]+$/, { message: "Domain must not contain spaces." }),
  client: z.string().optional(),
  logo: z
    .any()
    .refine((file) => file?.length === 1, "File must not be empty.")
    .refine(
      (file) =>
        ["pdf", "png", "jpg", "jpeg"]?.includes(
          file?.[0]?.name.split(".").pop()?.toLowerCase()
        ),
      "Only file .pdf .jpg, .jpeg, and .png allowed."
    )
    .refine((file) => file?.[0]?.size <= 10000000, "Max file size 10MB."),
});

export const AddTenantForm = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    api.get<User[]>("/user?filter=user_available").then((res) => {
      setUsers(res?.data);
    });
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      domain: "",
      client: "",
    },
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (value: any[]) => {
    const file = value[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    handleFileChange(form.getValues("logo"));
  }, [form.watch("logo")]);

  const FileRefs = form.register("logo", { required: true });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const fileName = `uploads/${Date.now()}_${values?.logo[0].name}`;

    // Upload to Supabase
    const { data: dataImage, error } = await supabase.storage
      .from("images") // Replace with your bucket name
      .upload(fileName, values?.logo[0]);

    if (error) {
      toast({ title: "Error", description: error.message });
      return;
    }

    const supaBaseResponse = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    // Save data
    const body = {
      name: values?.name,
      domain: values?.domain,
      clientId: values?.client ? values?.client : null,
      logo: supaBaseResponse?.data?.publicUrl,
    };

    try {
      api
        .post(`/tenant`, body)
        .then((res) => {
          setIsLoading(false);
          if (res.status === 201) {
            toast({
              title: "Success",
              description: "Tenant has been successfully added.",
            });
            setTimeout(() => {
              router.push("/admin/tenant");
            }, 1000);
          } else {
            toast({
              title: "Error",
              description: "Unexpected response status.",
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error adding user:", error);
          toast({
            title: "Error",
            description: "Failed to add user. Please try again.",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
      });
    }

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  return (
    <Form {...form}>
      {users && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-3/5 space-y-6 pb-12"
        >
          <div className="grid gap-3">
            {/* Tenant Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tenant Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Domain Field */}
            <div>
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="Starter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <small>{form.watch("domain")}.cloudexample.net</small>
            </div>
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user, i) => (
                          <SelectItem value={user?.id.toString()} key={i}>
                            {user?.firstName} {user?.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({}) => {
                return (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {/* Image preview */}
                        {selectedImage ? (
                          <div className="w-20 h-20 relative">
                            <Image
                              src={selectedImage}
                              alt="Selected"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center border border-dashed rounded-md">
                            <Upload className="text-gray-400" size={24} />
                          </div>
                        )}
                        {/* File input */}
                        <label className="cursor-pointer flex items-center gap-2">
                          <Upload className="text-gray-500" size={20} />
                          <span className="text-sm text-gray-600">
                            Choose Image
                          </span>
                          <Input
                            type="file"
                            placeholder="shadcn"
                            className="hidden"
                            {...FileRefs}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500"
          >
            {isLoading && <Spinner />}
            <span className={isLoading ? "ml-2" : ""}>Save</span>
          </Button>
        </form>
      )}
    </Form>
  );
};
