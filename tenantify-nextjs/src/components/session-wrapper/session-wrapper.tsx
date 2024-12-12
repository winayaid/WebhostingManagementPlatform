"use client"
import api from "@/services/api"
import { SessionProvider } from "next-auth/react"
import { SWRConfig } from "swr"

import React from "react"
import { fetcher } from "@/services/fetcher"

const SessionWrapper = ({
  children,
  jwt,
}: {
  children: React.ReactNode
  jwt?: string
}) => {
  if (jwt) {
    api.defaults.headers.Authorization = `Bearer ${jwt}`
  }
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  )
}

export default SessionWrapper
