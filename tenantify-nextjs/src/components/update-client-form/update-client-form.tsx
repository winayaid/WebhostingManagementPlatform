"use client";

import "react-phone-number-input/style.css";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
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
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { DeleteClientForm } from "../delete-client-form";
import { Spinner } from "../ui/spinner";

const FormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters." }),
  last_name: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters." }),
  date_of_birth: z.any(),
  email: z.string().email({ message: "Invalid email address." }),
  address_1: z.string().nonempty({ message: "Address 1 is required." }),
  address_2: z.string().optional(),
  city: z.string().nonempty({ message: "City is required." }),
  state: z.string().nonempty({ message: "State is required." }),
  zip_postcode: z.string().nonempty({ message: "Zip/Postcode is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  phone_number: z.string().nonempty({ message: "Phone number is required." }),
  tenant: z.string().optional(),
});

interface Tenant {
  id: string;
  name: string;
}

export function UpdateClientForm() {
  const param = useParams();
  const router = useRouter();
  const [phone, setPhone] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: user } = useSWR<User>(`/user/${param?.slug}`);
  const { data: tenants } = useSWR<Tenant[]>(
    `/tenant?userId=${param?.slug}&filter=tenant_available`
  );

  const defaultValues = {
    first_name: user?.firstName ?? "",
    last_name: user?.lastName ?? "",
    date_of_birth: user?.dateOfBirth
      ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
      : "",
    email: user?.email ?? "",
    address_1: user?.address1 ?? "",
    address_2: user?.address2 ?? "",
    city: user?.city ?? "",
    state: user?.state ?? "",
    zip_postcode: user?.zipCode ?? "",
    country: user?.country ?? "",
    phone_number: user?.phoneNumber ?? "",
    tenant: user?.tenant?.name ?? "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    // Find the tenant ID corresponding to the selected tenant name
    const selectedTenant = tenants?.find(
      (tenant) => tenant.name === data.tenant
    );

    const body = {
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: phone,
      dateOfBirth: new Date(data.date_of_birth).toISOString(),
      address1: data.address_1,
      address2: data.address_2,
      city: data.city,
      state: data.state,
      zipCode: data.zip_postcode,
      country: data.country,
      tenantId: selectedTenant ? parseInt(selectedTenant.id, 10) : null, // Use the found tenant ID
    };

    try {
      const response = await api.put(`/user/${user?.id}`, body);
      setIsLoading(false);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User has been successfully updated.",
        });
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
  }

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user?.phoneNumber);
    }
  }, [user]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/5 space-y-6 pb-12"
      >
        <div className="grid grid-cols-2 gap-3">
          {/* First Name Field */}
          <FormField
            control={form.control}
            name="first_name"
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
          {/* Last Name Field */}
          <FormField
            control={form.control}
            name="last_name"
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
          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="date_of_birth"
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
          {/* Email */}
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
          {/* Address 1 */}
          <FormField
            control={form.control}
            name="address_1"
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
            name="address_2"
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
            name="zip_postcode"
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
            name="phone_number"
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
        </div>

        <div className="flex space-x-3 items-center">
          <DeleteClientForm
            firstName={user?.firstName ?? ""}
            lastName={user?.lastName ?? ""}
            id={user?.id ?? ""}
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
}
