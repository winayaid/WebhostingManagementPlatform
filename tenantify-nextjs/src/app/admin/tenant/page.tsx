import Link from "next/link"

import { AdminLayout } from "@/components/admin-layout"
import { TenantTable } from "@/components/tenant-table"
import { Button } from "@/components/ui/button"

export default function DashboardTenant() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tenant</h1>
        <Link passHref href="/admin/tenant-add">
          <Button className="bg-sky-600">Add Tenant</Button>
        </Link>
      </div>
      <TenantTable />
    </AdminLayout>
  )
}
