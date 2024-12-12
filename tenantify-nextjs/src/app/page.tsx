"use client"

import { useEffect, useState } from "react"

import { LoginForm } from "@/components/login-form"
import api from "@/services/api"
import { useSession } from "next-auth/react"

export default function Home() {
  const session = useSession()
  const [logo, setLogo] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.location.hostname.split(".").length > 1) {
          api
            .get(`/tenant/check/${window.location.hostname.split(".")[0]}`)
            .then((res) => {
              setLogo(res?.data?.logo)
            })
            .catch(() => {
              if (session?.data?.user) {
                window.location.href = `/user`
              } else {
                window.location.href = `${process.env.NEXTAUTH_URL}`
              }
            })
        }
      } catch (error) {
        window.location.href = `${process.env.NEXTAUTH_URL}`
      }
    }
  }, [session])
  return (
    <div>
      <LoginForm logo={logo} />
    </div>
  )
}
