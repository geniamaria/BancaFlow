import type { UserRole } from "@/lib/api";

export interface NavItem {
  label: string;
  href: string;
}

export interface SidebarItem extends NavItem {
  soon?: boolean;
}

export const publicNavItems: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Agências", href: "/agencias" },
  { label: "Serviços", href: "/servicos" },
  { label: "Área do cliente", href: "/dashboard" },
];

export const footerNavItems: NavItem[] = [
  { label: "Agências", href: "/agencias" },
  { label: "Produtos e serviços", href: "/servicos" },
  { label: "Área do cliente", href: "/dashboard" },
  { label: "Painel administrativo", href: "/admin" },
];

export const clientSidebarItems: SidebarItem[] = [
  { label: "Visão geral", href: "/dashboard" },
  { label: "Agências", href: "/agencias" },
  { label: "Serviços e produtos", href: "/servicos" },
  { label: "Documentos", href: "/dashboard", soon: true },
  { label: "Atendimentos", href: "/dashboard", soon: true },
];

export function getAdminSidebarItems(role: UserRole | null | undefined): SidebarItem[] {
  if (role === "SUPER_ADMIN") {
    return [
      { label: "Visão geral", href: "/admin" },
      { label: "Bancos", href: "/admin/bancos" },
      { label: "Agências", href: "/admin/agencias" },
    ];
  }

  if (role === "BANK_ADMIN") {
    return [
      { label: "Visão geral", href: "/admin" },
      { label: "Bancos", href: "/admin/bancos" },
      { label: "Agências", href: "/admin/agencias" },
    ];
  }

  if (role === "BRANCH_MANAGER" || role === "EMPLOYEE") {
    return [
      { label: "Visão geral", href: "/admin" },
      { label: "Minhas agências", href: "/admin/minhas-agencias" },
    ];
  }

  return [{ label: "Visão geral", href: "/admin" }];
}

export function canAccessAdmin(role: UserRole | null | undefined): boolean {
  return (
    role === "SUPER_ADMIN" ||
    role === "BANK_ADMIN" ||
    role === "BRANCH_MANAGER" ||
    role === "EMPLOYEE"
  );
}
