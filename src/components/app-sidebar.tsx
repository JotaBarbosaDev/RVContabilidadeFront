import * as React from "react"
import {
  Calculator,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { getSidebarConfig } from "@/lib/sidebar-config"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, getAccessibleCompanies } = useAuth();
  
  if (!user) {
    return null;
  }

  const sidebarConfig = getSidebarConfig(user.type);
  const accessibleCompanies = getAccessibleCompanies();

  // Atualizar projetos com empresas acessíveis
  const projects = [
    ...sidebarConfig.projects.filter(p => p.name).map(p => ({
      name: p.name!,
      url: p.url,
      icon: p.icon || Calculator,
    })),
    ...accessibleCompanies.map(company => ({
      name: company.name,
      url: `#/company/${company.id}`,
      icon: Calculator,
    }))
  ];

  // Garantir que user tem avatar
  const userWithAvatar = {
    ...user,
    avatar: user.avatar || "/avatars/default.jpg"
  };

  return (
    <Sidebar variant="inset" className="bg-sidebar border-sidebar-border sidebar-accounting" {...props}>
      <SidebarHeader className="bg-sidebar border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild 
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground sidebar-menu-button"
            >
              <a href="#" className="text-sidebar-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground sidebar-brand">
                  <Calculator className="size-4 sidebar-icon" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">RV Contabilidade</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {user.type === 'client' && 'Portal do Cliente'}
                    {user.type === 'accountant' && 'Escritório Digital'}
                    {user.type === 'admin' && 'Administração'}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <NavMain items={sidebarConfig.navMain.filter(item => item.title).map(item => ({
          title: item.title!,
          url: item.url,
          icon: item.icon || Calculator,
          isActive: item.isActive,
          items: item.items
        }))} />
        <NavProjects projects={projects} />
        <NavSecondary items={sidebarConfig.navSecondary.filter(item => item.title).map(item => ({
          title: item.title!,
          url: item.url,
          icon: item.icon || Calculator
        }))} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
        <NavUser user={userWithAvatar} />
      </SidebarFooter>
    </Sidebar>
  )
}
