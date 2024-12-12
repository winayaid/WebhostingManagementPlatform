import "next-auth"

import { Team } from "@/restapi/teams/team"

declare module "next-auth" {
  interface User {
    jwt?: string
    user: {
      verify: boolean
      signature?: string
      address?: string
      id?: string
      addLater?: boolean
      _id?: string
      websiteKey?: string
      email?: string
      name?: string
      company?: string
      profilePicture?: string
      nftId?: string
      productUrl?: string
      wallet?: string
      deleted?: boolean
      role: "admin" | "caregiver" | "carenavigator" | "doctor"
      team?: Team.Entity
      business?: string[]
      fullname?: string
      isIdentityComplete?: boolean
      registration_complete?: boolean
      firstName?: string
      lastName?: string
      tenantId?: string
    }
  }

  interface Session {
    signature?: string
    address?: string
    accessToken?: string
    jwt?: string
    user?: User["user"]
    role?: User["user"]["role"]
    id?: string
    verify?: boolean
  }
}
