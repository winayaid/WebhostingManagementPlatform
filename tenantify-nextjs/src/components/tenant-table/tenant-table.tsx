"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";

interface User {
  firstName: string;
  lastName?: string;
}

interface Tenant {
  id: number;
  name: string;
  domain: string;
  logo?: string;
  user?: User;
}

export const TenantTable = () => {
  const { data: tenants } = useSWR<Tenant[]>("/tenant");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tenant Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Client Name</TableHead>
          <TableHead>Logo</TableHead>
          <TableHead className="w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants?.length !== 0 &&
          tenants?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item?.id}</TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell className="text-blue-500 cursor-pointer">
                <Link
                  href={`https://${item?.domain}.${window.location.hostname}`}
                  passHref
                  target="_blank"
                >
                  <span>
                    https://{item?.domain}.{window.location.hostname}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{item?.user?.firstName}</TableCell>
              <TableCell>
                <Image
                  src={`${
                    item?.logo ? item?.logo : "/static/images/star.webp"
                  }`}
                  width={80}
                  height={80}
                  alt={`${item?.name} logo`}
                />
              </TableCell>
              <TableCell>
                <Link passHref href={`/admin/tenant/${item?.id}`}>
                  <Button className="bg-blue-500">Manage</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
