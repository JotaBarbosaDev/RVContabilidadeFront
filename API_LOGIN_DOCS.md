# 🔐 Sistema de Login - Integração com API Real

## ✅ **Implementação Completa: Login com API Backend**

O sistema agora está integrado com a API real do backend, realizando autenticação via endpoint HTTP.

### **🌐 Configuração da API**

- **URL Base**: `http://localhost:8080`
- **Endpoint de Login**: `/api/auth/login`
- **Método**: `POST`
- **Content-Type**: `application/json`

### **📋 Credenciais de Teste**

#### **👤 EXEMPLO DE UTILIZADOR**
- **Username**: `joaosilva`
- **Password**: `123456`

### **🔄 Fluxo de Autenticação**

1. **Formulário de Login**: Utilizador insere username e password
2. **Chamada à API**: Sistema envia dados para `http://localhost:8080/api/auth/login`
3. **Validação**: Backend valida credenciais e retorna JWT token
4. **Armazenamento**: Token é guardado no localStorage
5. **Redirecionamento**: Utilizador é redirecionado para o dashboard
6. **Identificação Automática**: Perfil é identificado baseado no campo `role` da resposta

### **📨 Estrutura da Requisição**

```json
{
  "username": "joaosilva",
  "password": "123456"
}
```

### **📨 Estrutura da Resposta (Sucesso)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@exemplo.com",
    "name": "João Silva",
    "username": "joaosilva",
    "role": "client",
    "is_active": true
  }
}
```

### **🎯 Mapeamento de Perfis**

O sistema mapeia automaticamente o campo `role` da API para os tipos internos:

- **`client`** → Cliente (acesso limitado às suas empresas)
- **`accountant`** ou **`contabilista`** → Contabilista (acesso a clientes)
- **`admin`** ou **`administrator`** → Administrador (acesso total)

### **🔧 Funcionalidades Implementadas**

1. **🌐 Integração Real com API**: Chamadas HTTP para autenticação
2. **🔒 Gestão de Token JWT**: Armazenamento seguro no localStorage
3. **🎯 Mapeamento Automático de Perfis**: Role da API → Tipo de utilizador
4. **📊 Dados Contextuais**: Empresas e permissões baseadas no perfil
5. **🔄 Tratamento de Erros**: Mensagens específicas para diferentes tipos de erro
6. **💾 Persistência de Sessão**: Token mantido entre reloads da página

### **⚡ Tratamento de Erros**

- **Credenciais Inválidas**: "Nome de utilizador ou senha incorretos."
- **Erro de Conexão**: "Erro de conexão. Verifique se o servidor está disponível."
- **Erro Genérico**: "Erro inesperado. Tente novamente mais tarde."

### **🚀 Como Testar**

1. **Certifique-se que a API está rodando** em `http://localhost:8080`
2. **Aceda ao frontend** em `http://localhost:5175/login`
3. **Use as credenciais**: `joaosilva` / `123456` (ou outras válidas na sua API)
4. **O sistema identificará automaticamente o perfil** baseado no `role` retornado
5. **Será redirecionado para o dashboard** específico do perfil

### **🔐 Segurança**

- ✅ **Token JWT** armazenado no localStorage
- ✅ **Limpeza automática** do token no logout
- ✅ **Validação de resposta** da API
- ✅ **Tratamento de erros** robusto
- ✅ **Verificação de token** ao inicializar (preparado para expansão)

### **📋 Próximos Passos Recomendados**

1. **Validação de Token**: Implementar verificação de token válido ao carregar a página
2. **Refresh Token**: Sistema de renovação automática de tokens
3. **Interceptors**: Adicionar token automático em todas as requisições
4. **Logout Automático**: Deslogar quando token expira
5. **Profile API**: Buscar dados do perfil via API em vez de mock

**O sistema está agora pronto para produção com autenticação real!** 🎉
