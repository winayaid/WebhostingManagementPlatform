"use client"

import { UserCircleIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const ClientNavbar = () => {
  const handleLogout = () => {
    const { protocol, hostname, port } = window.location

    const redirectUrl = port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`

    signOut({ redirect: false })
    setTimeout(() => {
      window.location.href = redirectUrl
    }, 1000)
  }

  const session = useSession()

  return (
    <div className="w-full bg-white shadow sticky top-0 py-5 px-10 flex justify-end items-center">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserCircleIcon className="w-7 h-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <span className="font-normal">Sign in as</span>{" "}
              {session?.data?.user?.firstName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/user/account">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
