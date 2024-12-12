"use client"
import { AdminLayout } from "@/components/admin-layout"
import Link from "next/link"
import useSWR from "swr"

interface DashboardData {
  totalClients: number
  totalTenants: number
}

export default function Dashboard() {
  const { data } = useSWR<DashboardData>("dashboard")

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
      <div className="grid grid-cols-4 gap-5">
        <Link href="/admin/client">
          <div className="bg-white p-5 rounded shadow-md">
            <p className="text-2xl font-semibold">{data?.totalClients}</p>
            <p className="text-gray-500">Total Client</p>
          </div>
        </Link>
        <Link href="/admin/tenant">
          <div className="bg-white p-5 rounded shadow-md">
            <p className="text-2xl font-semibold">{data?.totalTenants}</p>
            <p className="text-gray-500">Total Tenant</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  )
}
