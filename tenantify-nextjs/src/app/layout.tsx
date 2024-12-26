import "./globals.css"

import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import localFont from "next/font/local"

import SessionWrapper from "@/components/session-wrapper/session-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { authOptions } from "@/services/auth"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Cloudnestr",
  description: "Web Hosting Management Platform",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <SessionWrapper jwt={session?.jwt}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  )
}
