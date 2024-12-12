"use client"
import { ClientSidebar } from "@/components/client-sidebar"
import { ClientNavbar } from "@/components/client-navbar"
import { useSession } from "next-auth/react"

interface ClientLayoutProps {
  children: React.ReactNode
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const session = useSession()

  if (session?.data?.user) {
    if (session?.data?.user?.verify === false) {
      window.location.href = `/auth/verify`
    }
  }

  return (
    <div className="flex bg-gray-50">
      <ClientSidebar />
      <div className="flex-1">
        <ClientNavbar />
        <main className="p-10">{children}</main>
      </div>
    </div>
  )
}
