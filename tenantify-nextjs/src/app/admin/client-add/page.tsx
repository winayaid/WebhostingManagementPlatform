import { AddClientForm } from "@/components/add-client-form"
import { AdminLayout } from "@/components/admin-layout"

export default function DashboardAddClient() {
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Add Client</h1>
      </div>
      <AddClientForm />
    </AdminLayout>
  )
}
