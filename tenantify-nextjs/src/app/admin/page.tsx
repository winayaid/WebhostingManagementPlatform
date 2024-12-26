"use client"
import { AdminLayout } from "@/components/admin-layout"
import { Tenant, User } from "@/types/user"
import Link from "next/link"
import useSWR from "swr"

export default function Dashboard() {
  const { data: tenants } = useSWR<Tenant[]>("/tenant")
  const { data: users } = useSWR<User[]>("/user")

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
      <div className="grid grid-cols-4 gap-5">
        <Link href="/admin/client">
          <div className="bg-white p-5 rounded shadow-md">
            <p className="text-2xl font-semibold">{users?.length}</p>
            <p className="text-gray-500">Total Client</p>
          </div>
        </Link>
        <Link href="/admin/tenant">
          <div className="bg-white p-5 rounded shadow-md">
            <p className="text-2xl font-semibold">{tenants?.length}</p>
            <p className="text-gray-500">Total Tenant</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  )
}
