"use client"

import { HouseIcon, StoreIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Sidebar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="w-[256px] h-screen bg-sky-600 sticky top-0 px-5 py-6">
      {/* <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center">
        <p className="text-2xl font-bold italic">Logo Here</p>
      </div> */}
      <div className="flex justify-center">
        <Image
          src={"/static/images/main-logo.png"}
          width={100}
          height={100}
          alt="qr code"
        />
      </div>
      <ul className="mt-10 space-y-3">
        <li>
          <div>
            <Link
              href="/admin"
              className={`flex py-2 px-4 rounded items-center space-x-2 text-white ${
                isActive("/admin") ? "bg-sky-800" : "hover:bg-sky-800"
              }`}
            >
              <HouseIcon />
              <span>Dashboard</span>
            </Link>
          </div>
        </li>
        <li>
          <div>
            <Link
              href="/admin/client"
              className={`flex py-2 px-4 rounded items-center space-x-2 text-white ${
                isActive("/admin/client") ? "bg-sky-800" : "hover:bg-sky-800"
              }`}
            >
              <UsersIcon />
              <span>Client</span>
            </Link>
          </div>
        </li>
        <li>
          <div>
            <Link
              href="/admin/tenant"
              className={`flex py-2 px-4 rounded items-center space-x-2 text-white ${
                isActive("/admin/tenant") ? "bg-sky-800" : "hover:bg-sky-800"
              }`}
            >
              <StoreIcon />
              <span>Tenant</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  )
}
