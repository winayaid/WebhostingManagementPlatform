import { AdminLayout } from "@/components/admin-layout"
import { ClientTable } from "@/components/client-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardClient() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Client</h1>
        <Link passHref href="/admin/client-add">
          <Button className="bg-blue-500">Add Client</Button>
        </Link>
      </div>
      <ClientTable />
    </AdminLayout>
  )
}
