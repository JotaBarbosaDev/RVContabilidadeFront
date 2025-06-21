# 🔄 CAMPOS TORNADOS OPCIONAIS NO REGISTO

## 📋 **MODIFICAÇÕES IMPLEMENTADAS**

### **Nova Lógica de Registo:**
Adicionei uma pergunta no **Passo 2 (Morada Fiscal)**: 
> **"Tem empresa ou atividade empresarial?"**
> - ✅ **Sim, tenho empresa/atividade empresarial**
> - ✅ **Não, apenas preciso de serviços pessoais (IRS)**

### **Fluxo Condicional:**
- **Se selecionar "NÃO"** → Salta os passos 3, 4 e 5 (empresa)
- **Se selecionar "SIM"** → Mantém o fluxo completo original

---

## 🚫 **CAMPOS TORNADOS OPCIONAIS (Para clientes sem empresa):**

### **📊 Passo 3 - Dados da Empresa (OPCIONAL):**
- `company_name` - Nome da empresa
- `nipc` - NIPC da empresa  
- `cae` - Código de Atividade Económica
- `legal_form` - Forma jurídica (Lda, SA, etc.)
- `founding_date` - Data de constituição

### **🏭 Passo 4 - Atividade Empresarial (OPCIONAL):**
- `business_activity` - Descrição da atividade empresarial
- `estimated_revenue` - Faturação estimada anual
- `monthly_invoices` - Número de faturas por mês
- `number_employees` - Número de funcionários

### **⚙️ Passo 5 - Regimes Fiscais (OPCIONAL):**
- `accounting_regime` - Regime de contabilidade
- `vat_regime` - Regime de IVA  
- `report_frequency` - Frequência de relatórios

---

## ✅ **CAMPOS OBRIGATÓRIOS (Para todos os clientes):**

### **👤 Passo 1 - Dados Pessoais:**
- `name` - Nome completo ✓
- `email` - Email único ✓
- `phone` - Telefone ✓
- `nif` - NIF válido ✓
- `date_of_birth` - Data de nascimento ✓

### **🏠 Passo 2 - Morada Fiscal:**
- `fiscal_address` - Morada fiscal ✓
- `fiscal_postal_code` - Código postal ✓
- `fiscal_city` - Cidade ✓
- `has_company` - Tem empresa? (SIM/NÃO) ✓

### **🔐 Passo 6 - Credenciais:**
- `username` - Username único ✓
- `password` - Password ✓
- `confirmPassword` - Confirmação ✓

---

## 🎯 **VALORES DEFAULT PARA CLIENTES SEM EMPRESA:**

Quando o cliente seleciona **"Não tenho empresa"**, os seguintes valores são aplicados automaticamente:

```javascript
{
  accounting_regime: 'simplificada',    // Contabilidade simplificada
  vat_regime: 'isento_art53',          // Isento de IVA 
  estimated_revenue: 0,                // Sem faturação empresarial
  monthly_invoices: 0,                 // Sem faturas empresariais
  businessType: 'Particular - IRS'     // Tipo de cliente
}
```

---

## 📱 **EXPERIÊNCIA DE UTILIZADOR:**

### **Para Clientes SEM Empresa (IRS):**
1. **Passo 1:** Dados Pessoais ✓
2. **Passo 2:** Morada Fiscal + Seleciona "Não tenho empresa" ✓
3. **Passo 3:** SALTADO automaticamente 🚫
4. **Passo 4:** SALTADO automaticamente 🚫  
5. **Passo 5:** SALTADO automaticamente 🚫
6. **Passo 6:** Credenciais ✓
7. **Passo 7:** Revisão (mostra apenas dados relevantes) ✓

### **Para Clientes COM Empresa:**
1. **Passo 1:** Dados Pessoais ✓
2. **Passo 2:** Morada Fiscal + Seleciona "Tenho empresa" ✓
3. **Passo 3:** Dados da Empresa ✓
4. **Passo 4:** Atividade Empresarial ✓
5. **Passo 5:** Regimes Fiscais ✓
6. **Passo 6:** Credenciais ✓
7. **Passo 7:** Revisão Completa ✓

---

## 📝 **REVISÃO CONDICIONAL:**

### **Se NÃO tem empresa - Mostra:**
- ✅ Dados Pessoais
- ✅ Morada Fiscal + Tipo: "Particular (IRS)"
- ✅ Serviços: Declaração IRS, Assessoria fiscal pessoal
- ✅ Credenciais

### **Se TEM empresa - Mostra:**
- ✅ Dados Pessoais  
- ✅ Morada Fiscal + Tipo: "Empresarial"
- ✅ Dados da Empresa
- ✅ Atividade Empresarial
- ✅ Regimes Fiscais
- ✅ Credenciais

---

## 🎉 **RESULTADO FINAL:**

**✨ Clientes particulares (IRS) agora podem registar-se rapidamente em apenas 4 passos essenciais!**

**✨ Clientes empresariais mantêm o fluxo completo com todos os dados obrigatórios!**

**✨ Navegação inteligente que adapta o formulário ao tipo de cliente!**
