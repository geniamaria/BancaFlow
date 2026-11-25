export type UserRole =
  | "SUPER_ADMIN"
  | "BANK_ADMIN"
  | "BRANCH_MANAGER"
  | "EMPLOYEE"
  | "CUSTOMER";

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  bankId: string | null;
  branchId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  expiresAt: string;
}

export interface BankDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  branchCount: number;
}

export interface BranchDto {
  id: string;
  bankId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  district: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentDto {
  id: string;
  userId: string;
  bankId: string;
  branchId: string;
  role: "BRANCH_MANAGER" | "EMPLOYEE";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  branchName?: string | null;
  userFullName?: string | null;
}

export interface StaffUserDto extends UserDto {
  assignments: AssignmentDto[];
}

export interface ApiErrorShape {
  error?: string;
  details?: unknown;
  message?: string | string[];
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const TOKEN_KEY = "bancaflow_token";
export const USER_KEY = "bancaflow_user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserDto | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserDto;
  } catch {
    return null;
  }
}

export function storeAuth(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const err = data as ApiErrorShape;
  if (typeof err.error === "string" && err.error.trim()) return err.error;
  if (typeof err.message === "string" && err.message.trim()) return err.message;
  if (Array.isArray(err.message)) {
    const msgs = err.message.filter((m): m is string => typeof m === "string");
    if (msgs.length > 0) return msgs.join(", ");
  }
  return fallback;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);

  if (init?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}/api/v1${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    clearAuth();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/entrar")) {
      window.location.href = "/entrar";
    }
    throw new ApiError("Sessão expirada. Inicie sessão novamente.", 401);
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data: unknown = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Erro na API (${response.status})`),
      response.status,
      data && typeof data === "object" ? (data as ApiErrorShape).details : undefined,
    );
  }

  return data as T;
}

export function toTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = value.match(/(\d{2}:\d{2})/);
    return match ? match[1] : "";
  }
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-MZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
