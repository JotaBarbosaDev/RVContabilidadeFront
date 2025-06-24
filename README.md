# RV Contabilidade - Frontend

Uma aplicação moderna de gestão contábil construída com React, TypeScript e shadcn/ui. Sistema completo de registro, autenticação e dashboard para contadores e clientes.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Sistema de componentes moderno
- **React Router DOM** - Roteamento para React
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Biblioteca de ícones
- **Framer Motion** - Animações e transições
- **GSAP** - Animações avançadas

## 📋 Funcionalidades

### ✅ Implementado
- **Sistema de Autenticação**: Login, registro e proteção de rotas
- **Múltiplos Tipos de Registro**: Cliente existente, novo cliente, contador
- **Dashboard Administrativo**: Gestão de usuários e solicitações
- **Dashboard de Cliente**: Interface personalizada para clientes
- **Validação de Formulários**: Validação robusta com Zod
- **Gestão de Estado**: Context API para autenticação e admin
- **Layout Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações**: Transições suaves e efeitos visuais
- **Sidebar Navegável**: Sistema de navegação intuitivo
- **Sistema de Notificações**: Toast notifications
- **Campo NIPC Opcional**: Configurado corretamente em todos os formulários

### � Recursos Técnicos
- **Proteção de Rotas**: ProtectedRoute component
- **Validação Customizada**: Hook useValidation
- **Componentes Validados**: ValidatedInput component
- **Gestão de Tokens**: Controle de expiração automático
- **TypeScript Strict**: Tipagem completa do projeto

## 🎨 Design

O projeto utiliza um design moderno e profissional com:
- Paleta de cores azul e cinza
- Componentes do shadcn/ui para consistência
- Layout responsivo com Tailwind CSS
- Ícones do Lucide React
- Animações sutis e transições suaves

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd RVContabilidadeFront

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting do código
npm run lint
```

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=RV Contabilidade
```

## 📊 Status do Projeto

### ✅ Concluído
- [x] Sistema de autenticação completo
- [x] Múltiplos formulários de registro
- [x] Validação robusta com Zod
- [x] Dashboard administrativo
- [x] Gestão de usuários e solicitações
- [x] Sistema de notificações
- [x] Layout responsivo
- [x] Animações e transições
- [x] Campo NIPC opcional configurado
- [x] Limpeza de ficheiros duplicados

### 🔄 Em Desenvolvimento
- [ ] Integração completa com API backend
- [ ] Gráficos e dashboards analíticos
- [ ] Sistema de relatórios
- [ ] Funcionalidades específicas de contabilidade

### 🚀 Próximas Funcionalidades
- [ ] Sistema de chat/mensagens
- [ ] Notificações push
- [ ] Exportação de relatórios
- [ ] Modo escuro
- [ ] Internacionalização (i18n)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── animations/            # Componentes de animação
│   ├── app-sidebar.tsx        # Sidebar principal
│   ├── DashboardLayout.tsx    # Layout do dashboard
│   ├── nav-*.tsx             # Componentes de navegação
│   ├── ProtectedRoute.tsx     # Proteção de rotas
│   ├── TokenExpiryNotification.tsx # Notificações de token
│   └── ValidatedInput.tsx     # Input com validação
├── contexts/
│   ├── AuthContext.tsx        # Context de autenticação
│   └── AdminContext.tsx       # Context administrativo
├── hooks/
│   ├── useAuth.ts            # Hook de autenticação
│   ├── useAdmin.ts           # Hook administrativo
│   ├── useValidation.ts      # Hook de validação
│   ├── useToast.ts           # Hook de notificações
│   └── use-mobile.ts         # Hook responsivo
├── lib/
│   ├── utils.ts              # Utilitários gerais
│   ├── validations.ts        # Schemas de validação
│   └── sidebar-config.ts     # Configuração da sidebar
├── pages/
│   ├── LandingPage.tsx       # Página inicial
│   ├── LoginPage.tsx         # Login
│   ├── RegisterPage.tsx      # Registro básico
│   ├── CompleteRegisterPage.tsx # Registro completo
│   ├── ReactiveRegisterPage.tsx # Registro reativo
│   ├── ExtendedRegisterPage.tsx # Registro estendido
│   ├── NewDashboardPage.tsx  # Dashboard principal
│   ├── DashboardPage.tsx     # Dashboard alternativo
│   ├── AdminDashboardPage.tsx # Dashboard admin
│   ├── AdminRequestsPage.tsx # Gestão de solicitações
│   ├── AdminRequestDetailsPage.tsx # Detalhes da solicitação
│   ├── AdminUsersPage.tsx    # Gestão de usuários
│   ├── AccountantClientsPage.tsx # Clientes do contador
│   ├── ClientProfilePage.tsx # Perfil do cliente
│   └── TestRegisterPage.tsx  # Página de teste
└── assets/                   # Recursos estáticos
```

## 🎯 Páginas e Funcionalidades

### Landing Page (`/`)
- Hero section com call-to-action animado
- Seção de recursos e benefícios
- Footer com links úteis
- Botão para acessar o login

### Autenticação
- **Login Page (`/login`)**: Interface de login responsiva com validação
- **Register Page (`/register`)**: Registro básico de usuários
- **Complete Register (`/complete-register`)**: Registro completo com validação avançada
- **Reactive Register (`/reactive-register`)**: Formulário reativo com validação em tempo real
- **Extended Register (`/extended-register`)**: Formulário estendido com todos os campos

### Dashboards
- **New Dashboard (`/dashboard`)**: Dashboard principal moderno
- **Dashboard Alternativo (`/dashboard-old`)**: Versão alternativa (fallback)
- **Admin Dashboard (`/admin/dashboard`)**: Painel administrativo

### Área Administrativa
- **Admin Requests (`/admin/requests`)**: Gestão de solicitações de registro
- **Request Details (`/admin/requests/:id`)**: Detalhes e aprovação de solicitações
- **Admin Users (`/admin/users`)**: Gestão de usuários do sistema

### Área do Cliente/Contador
- **Accountant Clients (`/accountant/clients`)**: Lista de clientes do contador
- **Client Profile (`/client/profile`)**: Perfil e dados do cliente

## 🔧 Configurações e Validações

### Sistema de Validação
- **Schemas Zod**: Validação robusta de formulários
- **Campo NIPC**: Configurado como opcional em todos os formulários
- **Validação em Tempo Real**: Feedback imediato para o usuário
- **Mensagens de Erro**: Personalizadas e intuitivas

### Autenticação e Segurança
- **JWT Tokens**: Gerenciamento automático de tokens
- **Proteção de Rotas**: ProtectedRoute component
- **Expiração de Sessão**: Notificações automáticas
- **Diferentes Tipos de Usuário**: Cliente, Contador, Admin

### Responsividade
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: Configuração responsiva completa
- **Hook use-mobile**: Detecção de dispositivos móveis

## 🔧 Configuração

### Tailwind CSS
Configurado com tema personalizado incluindo:
- Variáveis CSS para cores profissionais
- Suporte a modo escuro (preparado)
- Animações customizadas
- Paleta de cores para contabilidade

### TypeScript
- Configuração strict habilitada
- Path mapping (`@/*` → `src/*`)
- Tipos para todos os componentes
- Validação de tipos em build

### Vite
- Hot reload otimizado
- Build rápido para produção
- Suporte completo ao TypeScript
- Configuração de paths personalizada

### shadcn/ui
- Componentes pré-configurados
- Tema personalizado
- Variáveis CSS customizadas
- Componentes acessíveis por padrão

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (porta 5173)
- `npm run build` - Gera build de produção otimizada
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa ESLint para verificação de código

## 🧹 Manutenção e Limpeza

### Ficheiros Duplicados Removidos
Recentemente foi feita uma limpeza completa removendo:
- `src/hooks/use-mobile.tsx` (mantido apenas `.ts`)
- `src/index-clean.css` e `src/index-old.css` (mantido apenas `index.css`)
- `src/pages/AdminRequestDetailsPage_NEW.tsx` (mantido apenas a versão principal)

### Arquivos de Documentação
- `FICHEIROS_DUPLICADOS_REMOVIDOS.md` - Histórico de limpeza
- `NIPC_OPCIONAL_CONFIRMADO.md` - Documentação das correções do NIPC
- `DIAGNOSTICO_LABELS.md` - Análise de labels e asteriscos

## 🐛 Correções Importantes

### Campo NIPC Opcional ✅
- Configurado como opcional em todos os schemas de validação
- Removidos asteriscos vermelhos obrigatórios
- Envio condicional para o backend
- Validação correta em todos os formulários

### Duplicidade de Labels ✅
- Eliminadas labels duplicadas
- Removidos asteriscos manuais pretos
- Componentização correta dos inputs

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para novos arquivos
- Siga as convenções do ESLint configurado
- Componentes devem ter tipagem completa
- Use o padrão de nomes dos componentes shadcn/ui
- Mantenha a consistência com a estrutura existente

## 🏗️ Arquitetura

### Padrões Utilizados
- **Context Pattern**: Para gestão de estado global
- **Custom Hooks**: Para lógica reutilizável
- **Compound Components**: Para componentes complexos
- **Render Props**: Para compartilhamento de lógica
- **Higher-Order Components**: Para proteção de rotas

### Convenções
- Componentes em PascalCase
- Hooks começam com `use`
- Arquivos de página terminam com `Page.tsx`
- Contexts terminam com `Context.tsx`
- Utilitários em `lib/`

## � Performance

### Otimizações Implementadas
- Code splitting por rotas
- Lazy loading de componentes
- Otimização de bundles com Vite
- Tree shaking automático
- Compressão de assets

### Métricas
- Build size: ~1MB (gzipped: ~291KB)
- Time to Interactive: < 2s
- First Contentful Paint: < 1s

## �📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para RV Contabilidade**  
*Última atualização: 24 de junho de 2025*

