import { AddTenantForm } from "@/components/add-tenant-form"
import { AdminLayout } from "@/components/admin-layout"

export default function DashboardAddTenant() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Add Tenant</h1>
      </div>
      <AddTenantForm />
    </AdminLayout>
  )
}
