"use client";

import { useEffect, useState } from "react";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR from "swr";
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
import { Tenant } from "@/types/tenant";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { DeleteTenantForm } from "../delete-tenant-form";
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
  client: z.string().nonempty({ message: "Client is required." }),
  logo: z.any().optional(), // Logo is now optional
});

export const UpdateTenantForm = () => {
  const param = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: tenant } = useSWR<Tenant>(`/tenant/${param?.slug}`);
  const { data: users } = useSWR<User[]>(
    `/user?tenantId=${param?.slug}&filter=user_available`
  );

  const defaultValues = {
    name: tenant?.name ?? "",
    domain: tenant?.domain ?? "",
    client: `${tenant?.user?.firstName} ${tenant?.user?.lastName}` ?? "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: defaultValues,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (value: any[]) => {
    const file = value[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (form.getValues("logo")) {
      handleFileChange(form.getValues("logo"));
    }
  }, [form.watch("logo")]);

  const FileRefs = form.register("logo", { required: true });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    let urlLogo = "";

    // Check if a file is provided
    if (values?.logo?.[0]) {
      const file = values.logo[0];

      // Perform file validations
      const validExtensions = ["pdf", "png", "jpg", "jpeg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        toast({
          title: "Error",
          description: "Only .pdf, .jpg, .jpeg, and .png files are allowed.",
        });
        return;
      }

      if (file.size > 10_000_000) {
        toast({
          title: "Error",
          description: "File size must not exceed 10MB.",
        });
        return;
      }

      // Upload the file to Supabase
      const fileName = `uploads/${Date.now()}_${file.name}`;
      const { data: dataImage, error } = await supabase.storage
        .from("images") // Replace with your bucket name
        .upload(fileName, file);

      if (error) {
        toast({ title: "Error", description: error.message });
        return;
      }

      const supaBaseResponse = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      urlLogo = supaBaseResponse?.data?.publicUrl;
    }

    // Find the tenant ID corresponding to the selected tenant name
    const selectedClient = users?.find(
      (user) => user.firstName === values.client.split(" ")[0]
    );

    // Save data
    const body = {
      name: values.name,
      domain: values.domain,
      clientId: selectedClient
        ? selectedClient.id.toString()
        : tenant?.clientId,
      logo: urlLogo || tenant?.logo,
    };

    try {
      const res = await api.put(`/tenant/${tenant?.id}`, body);
      setIsLoading(false);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Tenant has been successfully updated.",
        });
        setTimeout(() => {
          router.push("/admin/tenant");
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: res.status,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating tenant:", error);
      toast({
        title: "Error",
        description: "Failed to update tenant. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
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
                      {users?.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={`${user.firstName} ${user.lastName}`}
                        >
                          {`${user.firstName} ${user.lastName}`}
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

        <div className="flex space-x-3 items-center">
          <DeleteTenantForm
            id={tenant?.id ? tenant?.id : ""}
            name={tenant?.name ? tenant?.name : ""}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500"
          >
            {isLoading && <Spinner />}
            <span className={isLoading ? "ml-2" : ""}>Save Changes</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};
