import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => (
  <div className="flex bg-gray-50">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <main className="p-10">{children}</main>
    </div>
  </div>
)
