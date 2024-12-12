import { AdminLayout } from "@/components/admin-layout"
import { UpdateTenantForm } from "@/components/update-tenant-form"

export default function DashboardUpdateTenant() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Update Tenant</h1>
      </div>
      <UpdateTenantForm />
    </AdminLayout>
  )
}
