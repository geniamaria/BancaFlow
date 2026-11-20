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

export const adminSidebarItems: SidebarItem[] = [
  { label: "Visão geral", href: "/admin" },
  { label: "Agências", href: "/agencias" },
  { label: "Serviços e produtos", href: "/servicos" },
  { label: "Clientes", href: "/admin", soon: true },
  { label: "Relatórios", href: "/admin", soon: true },
];
