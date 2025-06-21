# 🎯 REGISTO EXPANDIDO - RV CONTABILIDADE

## ✅ IMPLEMENTAÇÃO COMPLETA

### 📋 **DADOS OBRIGATÓRIOS PARA REGISTO**
O sistema agora recolhe TODOS os dados mínimos obrigatórios para aprovação:

#### 👤 **Dados Pessoais Mínimos**
- Username (único)
- Nome completo 
- Email (único, validado)
- Telefone (validado para PT)
- NIF (validado com algoritmo português)
- Data de nascimento (>18 anos)
- Password (min 6 chars)

#### 🏠 **Morada Fiscal Básica**
- Endereço fiscal completo
- Código postal (formato XXXX-XXX)
- Cidade

#### 🏢 **Dados Empresa Mínimos**
- Nome da empresa
- NIPC (único, validado)
- CAE (5 dígitos, validado)
- Forma jurídica (Lda, SA, Unipessoal, etc.)
- Data de constituição

#### ⚙️ **Regimes Fiscais**
- Regime de contabilidade (organizada/simplificada)
- Regime de IVA (normal/isento/pequeno retalhista)
- Frequência de relatórios (mensal/trimestral)

#### 📊 **Operacionais Básicos**
- Descrição detalhada da atividade (min 10 chars)
- Faturação estimada anual
- Número de faturas por mês
- Número de funcionários (opcional)

---

## 🎯 **FLUXO MULTI-ETAPAS IMPLEMENTADO**

### **Página: `/register-extended`**

**7 Etapas com validação reativa:**

1. **👤 Dados Pessoais** - Nome, email, telefone, NIF, data nascimento
2. **🏠 Morada Fiscal** - Endereço, código postal, cidade
3. **🏢 Dados da Empresa** - Nome empresa, NIPC, CAE, forma jurídica, data constituição
4. **📊 Atividade Empresarial** - Descrição atividade, faturação, faturas/mês, funcionários
5. **⚙️ Regimes Fiscais** - Contabilidade, IVA, frequência relatórios
6. **🔐 Credenciais** - Username, password, confirmação
7. **✅ Revisão** - Resumo completo antes de submeter

### **Funcionalidades:**
- ✅ **Validação reativa** em tempo real
- ✅ **Navegação inteligente** (só avança se válido)
- ✅ **Progresso visual** com ícones e barras
- ✅ **Dicas contextuais** para cada campo
- ✅ **Revisão completa** antes do envio
- ✅ **Feedback de erro/sucesso** após submissão

---

## 🔐 **PERFIL DO CLIENTE ATUALIZADO**

### **Página: `/profile`**

#### **3 Abas Distintas:**

1. **📋 Dados do Registo (APENAS LEITURA)**
   - Mostra todos os dados enviados no registo
   - **NÃO editáveis** - são os dados aprovados pela administração
   - Incluí: dados pessoais, morada fiscal, empresa, regimes, atividade

2. **👤 Dados Pessoais Adicionais (EDITÁVEIS)**
   - Estado civil, CC, telefone fixo
   - Credenciais portais (Portal Finanças, e-Fatura, SS Direto)
   - Email oficial, software facturação
   - Preferências de contacto

3. **🏢 Dados Empresa Adicionais (EDITÁVEIS)**
   - Nome comercial, objeto social
   - Morada da empresa, dados bancários
   - Faturação anual, stock, clientes/fornecedores principais

#### **Funcionalidades:**
- ✅ **Contador de campos em falta** (badges coloridos)
- ✅ **Edição só dos dados adicionais** (não dos do registo)
- ✅ **Envio separado** para endpoints específicos
- ✅ **Validação de campos** antes do envio
- ✅ **Feedback visual** de sucesso/erro

---

## 🎨 **UX/UI MELHORADAS**

### **Landing Page**
- ✅ **Secção CTA nova** com botão "Registar a Minha Empresa"
- ✅ **Link direto** para `/register-extended`

### **Login Page**  
- ✅ **Link atualizado** "Registar a minha empresa" → `/register-extended`

### **Navegação**
- ✅ **Menu de utilizador** com acesso ao perfil
- ✅ **Breadcrumbs** contextuais

---

## 🛠 **ESTRUTURA TÉCNICA**

### **Arquivos Principais:**
```
src/pages/ExtendedRegisterPage.tsx   # Registo multi-etapas expandido
src/pages/ClientProfilePage.tsx      # Perfil com tabs editáveis
src/lib/validations.ts               # Schemas Zod expandidos
src/components/ValidatedInput.tsx    # Input com validação reativa
```

### **Rotas Configuradas:**
```
/register-extended  # Registo expandido (público)
/profile           # Perfil do cliente (protegido)
/login             # Login (redireciona para registo expandido)
/                  # Landing page (CTA para registo expandido)
```

### **Schema de Validação:**
- ✅ **35+ campos validados** com Zod
- ✅ **Validadores reativos** para NIF, NIPC, CAE, telefone, etc.
- ✅ **Feedback em tempo real** com dicas e erros contextuais

---

## 🚀 **COMO TESTAR**

1. **Aceder ao registo:** http://localhost:5174/register-extended
2. **Completar todas as 7 etapas** (dados obrigatórios)
3. **Submeter registo** → aguardar aprovação
4. **Fazer login** → aceder ao perfil
5. **Completar dados adicionais** nas abas editáveis

---

## ✅ **FLUXO FINAL IMPLEMENTADO**

```
🏠 Landing Page
    ↓ "Registar a Minha Empresa"
📝 Registo Expandido (7 etapas)
    ↓ Todos os dados obrigatórios preenchidos
✅ Submissão → Aguarda aprovação admin
    ↓
🔐 Login (após aprovação)
    ↓
🏠 Dashboard
    ↓ "Meu Perfil"
📋 Perfil do Cliente
    ├── Tab 1: Dados do Registo (APENAS LEITURA)
    ├── Tab 2: Dados Pessoais Adicionais (EDITÁVEIS)
    └── Tab 3: Dados Empresa Adicionais (EDITÁVEIS)
```

---

## 🎯 **RESULTADO FINAL**

✅ **REGISTO:** Recolhe TODOS os dados obrigatórios para aprovação  
✅ **PERFIL:** Cliente só edita dados adicionais, não os do registo  
✅ **UX:** Fluxo intuitivo e guiado com validações reais  
✅ **BACKEND:** Endpoints separados para registo vs. dados adicionais  

**O cliente agora passa pelo registo completo e depois só precisa de completar os dados adicionais no perfil!** 🎉
