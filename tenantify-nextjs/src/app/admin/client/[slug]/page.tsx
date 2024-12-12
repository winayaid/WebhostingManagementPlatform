import { AdminLayout } from "@/components/admin-layout"
import { UpdateClientForm } from "@/components/update-client-form"

export default function DashboardUpdateClient() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Update Client</h1>
      </div>
      <UpdateClientForm />
    </AdminLayout>
  )
}
