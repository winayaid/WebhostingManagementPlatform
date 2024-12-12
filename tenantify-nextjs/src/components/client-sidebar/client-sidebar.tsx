"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { HouseIcon } from "lucide-react"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import Image from "next/image"

export const ClientSidebar = () => {
  const session = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/user") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const { data: tenant } = useSWR(`/tenant/${session?.data?.user?.tenantId}`)

  return (
    <div className="w-[256px] h-screen bg-blue-400 sticky top-0 px-5 py-6">
      <div className="w-full h-16 flex items-center justify-center relative">
        {tenant?.logo && (
          <Image
            src={tenant?.logo}
            objectFit="contain"
            layout="fill"
            className="absolute w-full h-full"
            alt="logo"
          />
        )}
      </div>
      <ul className="mt-10 space-y-3">
        <li>
          <div>
            <Link
              href="/user"
              className={`flex py-2 px-4 rounded items-center space-x-2 ${
                isActive("/user")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              <HouseIcon />
              <span>Dashboard</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  )
}
