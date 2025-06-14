# RV Contabilidade - Frontend

Uma aplicação moderna de gestão contábil construída com React, TypeScript e shadcn/ui.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Sistema de componentes moderno
- **React Router DOM** - Roteamento para React
- **Lucide React** - Biblioteca de ícones

## 📋 Funcionalidades

### ✅ Implementado (Design)
- **Landing Page**: Página inicial promocional responsiva
- **Login Page**: Interface de autenticação elegante
- **Dashboard**: Painel principal com sidebar navegável
- **Layout Responsivo**: Funciona em desktop e mobile
- **Sistema de Roteamento**: Navegação entre páginas

### 🔄 Para Implementar (Lógica)
- Autenticação de usuários
- Integração com API backend
- Funcionalidades específicas do dashboard
- Gráficos e visualizações
- Sistema de notificações

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
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── ui/           # Componentes shadcn/ui
├── hooks/            # Custom hooks
├── lib/              # Utilitários
├── pages/            # Páginas da aplicação
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
└── ...
```

## 🎯 Páginas

### Landing Page (`/`)
- Hero section com call-to-action
- Seção de recursos e benefícios
- Footer com links úteis
- Botão para acessar o login

### Login Page (`/login`)
- Formulário de login responsivo
- Opções de login social (design apenas)
- Link para recuperação de senha
- Validação visual de campos

### Dashboard (`/dashboard`)
- Sidebar com navegação
- Cards de métricas
- Área de conteúdo dinâmica
- Header com perfil do usuário

## 🔧 Configuração

### Tailwind CSS
Configurado com tema personalizado incluindo:
- Variáveis CSS para cores
- Suporte a modo escuro
- Animações customizadas

### TypeScript
- Configuração strict habilitada
- Path mapping (`@/*` → `src/*`)
- Tipos para todos os componentes

### Vite
- Hot reload otimizado
- Build rápido para produção
- Suporte completo ao TypeScript

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Executa linting

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para RV Contabilidade**

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
