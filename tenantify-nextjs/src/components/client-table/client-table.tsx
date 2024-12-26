"use client"

import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/user"

import { Button } from "../ui/button"
import useSWR from "swr"

export const ClientTable = () => {
  const { data: users } = useSWR<User[]>("/user")

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tenant Name</TableHead>
          <TableHead className="w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: User, i: number) => (
          <TableRow key={i}>
            <TableCell>{user?.id}</TableCell>
            <TableCell>
              {user.firstName} {user?.lastName}
            </TableCell>
            <TableCell>{user?.email}</TableCell>
            <TableCell>{user?.tenant && user?.tenant?.name}</TableCell>
            <TableCell>
              <Link passHref href={`/admin/client/${user?.id}`}>
                <Button className="bg-sky-600">Manage</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
