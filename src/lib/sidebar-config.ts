import {
  Calculator,
  DollarSign,
  Home,
  LifeBuoy,
  Send,
  Users,
  Building,
  PieChart,
  Receipt,
  FileText,
  Activity,
  Database,
  Shield,
  UserCog,
  type LucideIcon
} from "lucide-react";
import type { UserType } from "@/contexts/AuthContext";

export interface NavItem {
  title?: string;
  name?: string; // Para projects
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarConfig {
  navMain: NavItem[];
  navSecondary: NavItem[];
  projects: NavItem[];
}

// Configuração para Cliente
export const clientSidebarConfig: SidebarConfig = {
  navMain: [
    {
      title: "Painel de Controlo",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "#",
        },
        {
          title: "As Minhas Empresas",
          url: "#",
        },
      ],
    },
    {
      title: "Documentos",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Faturas",
          url: "#",
        },
        {
          title: "Recibos",
          url: "#",
        },
        {
          title: "Outros Documentos",
          url: "#",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Situação Fiscal",
          url: "#",
        },
        {
          title: "Balancetes",
          url: "#",
        },
        {
          title: "Demonstração de Resultados",
          url: "#",
        },
      ],
    },
    {
      title: "Obrigações",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "Calendário Fiscal",
          url: "#",
        },
        {
          title: "Estado das Declarações",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "As Minhas Empresas",
      url: "#",
      icon: Building,
    },
  ],
};

// Configuração para Contabilista
export const accountantSidebarConfig: SidebarConfig = {
  navMain: [
    {
      title: "Painel de Controlo",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "#",
        },
        {
          title: "Métricas Contabilísticas",
          url: "#",
        },
        {
          title: "Relatórios Executivos",
          url: "#",
        },
      ],
    },
    {
      title: "Financeiro",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Contas a Pagar",
          url: "#",
        },
        {
          title: "Contas a Receber",
          url: "#",
        },
        {
          title: "Tesouraria",
          url: "#",
        },
        {
          title: "Reconciliação Bancária",
          url: "#",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Balancetes",
          url: "#",
        },
        {
          title: "Demonstração de Resultados",
          url: "#",
        },
        {
          title: "Balanço",
          url: "#",
        },
        {
          title: "Anexos SNC",
          url: "#",
        },
      ],
    },
    {
      title: "Clientes",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Gestão de Clientes",
          url: "/accountant/clients",
        },
        {
          title: "Documentos",
          url: "#",
        },
        {
          title: "Contratos",
          url: "#",
        },
        {
          title: "Comunicação",
          url: "#",
        },
      ],
    },
    {
      title: "Contabilidade",
      url: "#",
      icon: Calculator,
      items: [
        {
          title: "Lançamentos",
          url: "#",
        },
        {
          title: "Plano de Contas",
          url: "#",
        },
        {
          title: "Centros de Custo",
          url: "#",
        },
        {
          title: "Escrituração",
          url: "#",
        },
      ],
    },
    {
      title: "Fiscal",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "Obrigações Acessórias",
          url: "#",
        },
        {
          title: "SAF-T (PT)",
          url: "#",
        },
        {
          title: "Declarações IVA",
          url: "#",
        },
        {
          title: "Calendário Fiscal",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Empresas Recentes",
      url: "#",
      icon: Building,
    },
  ],
};

// Configuração para Admin
export const adminSidebarConfig: SidebarConfig = {
  navMain: [
    {
      title: "Painel Administrativo",
      url: "/admin",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "/admin",
        },
        {
          title: "Métricas do Sistema",
          url: "/admin/metrics",
        },
        {
          title: "Logs de Auditoria",
          url: "/admin/logs",
        },
      ],
    },
    {
      title: "Gestão de Solicitações",
      url: "/admin/requests",
      icon: FileText,
      items: [
        {
          title: "Todas as Solicitações",
          url: "/admin/requests",
        },
        {
          title: "Pendentes",
          url: "/admin/requests?status=pending",
        },
        {
          title: "Aprovadas",
          url: "/admin/requests?status=approved",
        },
        {
          title: "Rejeitadas",
          url: "/admin/requests?status=rejected",
        },
      ],
    },
    {
      title: "Gestão de Utilizadores",
      url: "/admin/users",
      icon: UserCog,
      items: [
        {
          title: "Todos os Utilizadores",
          url: "/admin/users",
        },
        {
          title: "Utilizadores Ativos",
          url: "/admin/users?status=active",
        },
        {
          title: "Utilizadores Inativos",
          url: "/admin/users?status=inactive",
        },
        {
          title: "Administradores",
          url: "/admin/users?role=admin",
        },
      ],
    },
    {
      title: "Sistema",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Configurações",
          url: "#",
        },
        {
          title: "Cópias de Segurança",
          url: "#",
        },
        {
          title: "Integrações",
          url: "#",
        },
        {
          title: "Atualizações",
          url: "#",
        },
      ],
    },
    {
      title: "Segurança",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Logs de Acesso",
          url: "#",
        },
        {
          title: "Tentativas de Login",
          url: "#",
        },
        {
          title: "Políticas de Segurança",
          url: "#",
        },
      ],
    },
    {
      title: "Monitorização",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "Performance",
          url: "#",
        },
        {
          title: "Uso de Recursos",
          url: "#",
        },
        {
          title: "Alertas",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentação",
      url: "#",
      icon: FileText,
    },
    {
      title: "Suporte Técnico",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Todos os Clientes",
      url: "#",
      icon: Users,
    },
    {
      name: "Todas as Empresas",
      url: "#",
      icon: Building,
    },
  ],
};

export const getSidebarConfig = (userType: UserType): SidebarConfig => {
  switch (userType) {
    case 'client':
      return clientSidebarConfig;
    case 'accountant':
      return accountantSidebarConfig;
    case 'admin':
      return adminSidebarConfig;
    default:
      return clientSidebarConfig;
  }
};
