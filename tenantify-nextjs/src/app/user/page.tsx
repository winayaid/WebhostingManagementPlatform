"use client"
import { ClientLayout } from "@/components/client-layout"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const session = useSession()
  return (
    <ClientLayout>
      <h1 className="text-2xl font-semibold mb-5">
        Hi {session?.data?.user?.firstName} {session?.data?.user?.lastName}
      </h1>
    </ClientLayout>
  )
}
