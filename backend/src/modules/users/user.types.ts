import type { UserRole } from "@prisma/client";

export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  bankId: string | null;
  branchId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
