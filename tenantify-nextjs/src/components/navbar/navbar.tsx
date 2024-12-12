"use client"
import { UserCircleIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"

export const Navbar = () => {
  const Logout = async () => {
    signOut({ redirect: false })
    setTimeout(() => {
      window.location.href = "/"
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
            <DropdownMenuItem onClick={() => Logout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
