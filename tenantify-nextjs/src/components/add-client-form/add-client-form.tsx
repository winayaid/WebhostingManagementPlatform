"use client";

import "react-phone-number-input/style.css";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
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
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { Spinner } from "../ui/spinner";

// Schema for user form validation
const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters." }),
  dateOfBirth: z.string().nonempty({ message: "Date of Birth is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  address1: z.string().nonempty({ message: "Address 1 is required." }),
  address2: z.string().optional(),
  city: z.string().nonempty({ message: "City is required." }),
  state: z.string().nonempty({ message: "State is required." }),
  zipCode: z.string().nonempty({ message: "Zip/Postcode is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  // phoneNumber: z.string().nonempty({ message: "Phone number is required." }),
  username: z.string().nonempty({ message: "Username is required." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  tenant: z.string().optional(),
});

interface Tenant {
  id: string;
  name: string;
}

export function AddClientForm() {
  const router = useRouter();
  const { data: tenants } = useSWR<Tenant[]>("/tenant?filter=tenant_available");
  const [phone, setPhone] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      // phoneNumber: "",
      username: "",
      password: "",
      tenant: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    if (!phone) {
      toast({
        title: "Error",
        description: "Please complete the phone number.",
      });
      return;
    }
    // Find the tenant ID corresponding to the selected tenant name
    const selectedTenant = tenants?.find(
      (tenant) => tenant.name === values.tenant
    );

    const body = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      dateOfBirth: new Date(values?.dateOfBirth).toISOString(),
      email: values?.email,
      address1: values?.address1,
      address2: values?.address2,
      city: values?.city,
      state: values?.state,
      zipCode: values.zipCode,
      country: values?.country,
      phoneNumber: phone,
      username: values?.username,
      password: values?.password,
      role: "CLIENT",
      tenantId: selectedTenant ? parseInt(selectedTenant.id, 10) : null, // Use the found tenant ID
    };
    try {
      const response = await api.post(`/user`, body);
      setIsLoading(false);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "User has been successfully added.",
        });
        form.reset();
        setTimeout(() => {
          router.push("/admin/client");
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Unexpected response status.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/5 space-y-6 pb-12"
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Form fields */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input placeholder="Address 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address 2 */}
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Input placeholder="Address 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Zip/Postcode */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postcode</FormLabel>
                <FormControl>
                  <Input placeholder="Zip/Postcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phone Number */}
          {/* <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="flex flex-col space-y-2">
            <h1>Phone Number</h1>
            <PhoneInput
              defaultCountry="US"
              value={phone}
              onChange={setPhone}
              international
              className="border px-2 py-1.5 rounded shadow-sm"
            />
          </div>

          {/* Tenant */}
          <FormField
            control={form.control}
            name="tenant"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants?.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.name}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* Company Name */}
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
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
    </Form>
  );
}
