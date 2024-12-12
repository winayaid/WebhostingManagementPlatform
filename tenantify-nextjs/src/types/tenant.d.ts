export interface Tenant {
  id: number;
  name: string;
  domain: string;
  clientId?: string | null;
  logo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  phoneNumber?: string | null;
  role: UserRole;
  companyName?: string | null;
  dateOfBirth?: Date | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  password: string;
  twoFactorSecret?: string | null;
  qrCode?: string | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: number | null;
  tenant?: Tenant | null;
}

export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}
