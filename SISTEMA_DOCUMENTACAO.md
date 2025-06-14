# Sistema RV Contabilidade - Documentação

## Visão Geral
Sistema web desenvolvido em React + TypeScript para gestão contábil, permitindo que contabilistas gerenciem clientes e empresas, e que clientes acessem seus próprios dados e documentos.

## Funcionalidades Implementadas

### 🎨 Design e Interface
- **Paleta de cores profissional**: Sistema completo de cores através de variáveis CSS (:root)
- **Design responsivo**: Compatível com desktop, tablet e mobile
- **Componentes shadcn/ui**: Interface moderna e acessível
- **Tema contábil**: Ícones, textos e layout específicos para área contábil

### 🏠 Landing Page
- **Apresentação profissional** do escritório contábil
- **Seções específicas**: Soluções, diferenciais, depoimentos
- **Call-to-actions**: Portal do cliente e área contábil
- **Informações corporativas**: CRC, CNPJ, contatos

### 🔐 Sistema de Login
- **Três tipos de acesso**:
  - Cliente: Acesso aos próprios dados e documentos
  - Contador: Gestão de múltiplos clientes e empresas
  - Administrador: Acesso completo ao sistema
- **Demos funcionais**: Botões para teste rápido
- **Interface diferenciada**: Seleção visual do tipo de usuário

### 📊 Dashboard Contábil
- **KPIs específicos**: Empresas ativas, receita, obrigações, conformidade
- **Visão de clientes**: Lista com status e informações importantes
- **Agenda fiscal**: Próximas obrigações e prazos
- **Área para gráficos**: Espaço preparado para futura implementação

### 👤 Perfil do Cliente
- **Informações empresariais**: Dados da empresa, CNPJ, regime tributário
- **Múltiplas empresas**: Gestão de matriz e filiais
- **Documentos**: Upload e acompanhamento de status
- **Obrigações**: Calendário fiscal personalizado

### 🎨 Sistema de Cores Customizável
Todas as cores são controladas via variáveis CSS em `:root`:

```css
:root {
  /* Cores primárias da contabilidade */
  --accounting-primary: 210 100% 40%;      /* Azul profissional */
  --accounting-secondary: 195 100% 42%;    /* Azul claro */
  --accounting-success: 142 76% 36%;       /* Verde para sucesso */
  --accounting-warning: 38 92% 50%;        /* Amarelo para avisos */
  --accounting-error: 0 84% 60%;           /* Vermelho para erros */
  --accounting-surface: 220 14% 96%;       /* Cinza claro para fundos */
}
```

### 🔧 Arquitetura Técnica
- **React 18 + TypeScript**: Desenvolvimento tipado e moderno
- **Vite**: Build tool rápido e eficiente
- **Tailwind CSS**: Estilização utilitária
- **shadcn/ui**: Sistema de componentes consistente
- **React Router**: Navegação entre páginas
- **Lucide React**: Ícones modernos e consistentes

## Estrutura de Arquivos
```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── app-sidebar.tsx  # Menu lateral
│   └── DashboardLayout.tsx # Layout padrão
├── pages/
│   ├── LandingPage.tsx     # Página inicial
│   ├── LoginPage.tsx       # Sistema de login
│   ├── DashboardPage.tsx # Dashboard principal
│   └── ClientProfilePage.tsx # Perfil do cliente
├── hooks/               # Custom hooks
├── lib/                # Utilitários
└── index.css           # Variáveis de cor e estilos globais
```

## Diferenciação de Perfis

### 👨‍💼 Contador/Administrador
- Visualização de múltiplos clientes
- Gestão de empresas e documentos
- Métricas consolidadas
- Agenda fiscal completa
- Ferramentas de relatórios

### 🏢 Cliente
- Visualização apenas dos próprios dados
- Upload de documentos
- Acompanhamento de obrigações
- Gestão de múltiplas empresas próprias
- Comunicação com contador

## Customização de Cores

Para alterar o tema do sistema, edite as variáveis em `src/index.css`:

```css
:root {
  /* Altere estas variáveis para personalizar o tema */
  --accounting-primary: 210 100% 40%;    /* Cor principal */
  --accounting-secondary: 195 100% 42%;  /* Cor secundária */
  /* ... demais variáveis */
}
```

## Próximos Passos
- [ ] Implementação de autenticação real
- [ ] Integração com backend/API
- [ ] Gráficos e visualizações de dados
- [ ] Sistema de notificações
- [ ] Upload real de documentos
- [ ] Geração de relatórios PDF
- [ ] Chat interno entre cliente/contador

## Executar o Projeto
```bash
npm install
npm run dev
```

Acesse: http://localhost:5174

## URLs do Sistema
- `/` - Landing page
- `/login` - Sistema de login
- `/dashboard` - Dashboard principal
- `/profile` - Perfil do cliente

## Tecnologias Utilizadas
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Lucide React
- class-variance-authority
