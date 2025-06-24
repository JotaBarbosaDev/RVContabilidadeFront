import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserType = 'client' | 'accountant' | 'admin';

export interface Company {
  id: string;
  name: string;
  nipc: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  type: UserType;
  avatar?: string;
  // Dados específicos por tipo
  companies?: Company[]; // Para clientes - empresas que possuem
  permissions?: string[]; // Para admin/contabilista
  clientCompanies?: string[]; // Para contabilista - empresas dos clientes que gere
  token?: string; // Token JWT da API
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<{ message: string; requestId?: string }>;
  logout: (callApi?: boolean) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Funções de permissão
  hasPermission: (permission: string) => boolean;
  canViewCompany: (companyId: string) => boolean;
  getAccessibleCompanies: () => Company[];
  canViewAdminFeatures: () => boolean;
  canManageClients: () => boolean;
  // Funções de token
  isTokenValid: () => boolean;
  checkTokenExpiry: () => void;
}

interface RegisterFormData {
  type?: 'existing-client' | 'new-client';
  username?: string;
  password?: string;
  name: string;
  nif: string;
  nipc?: string; // Campo opcional adicionado
  email: string;
  phone: string;
  businessType?: string;
  businessTypeOther?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  dateOfBirth?: string; // Campo obrigatório adicionado
  fiscalAddress?: string; // Campo obrigatório adicionado
  fiscalPostalCode?: string; // Campo obrigatório adicionado
  fiscalCity?: string; // Campo obrigatório adicionado
  accessType?: string;
  accountingRegime?: string;
  vatRegime?: string; // Campo obrigatório adicionado
  businessActivity?: string; // Campo obrigatório adicionado
  foundingDate?: string; // Campo obrigatório adicionado
  reportFrequency?: string; // Campo obrigatório adicionado
  estimatedRevenue?: string;
  monthlyDocuments?: string;
  documentDelivery?: string;
  invoicingTool?: string;
  hasActivity?: string;
  hasSocialSecurity?: string;
  hasEmployees?: string;
  hasDebts?: string;
  observations?: string;
  documents?: File[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar se o token é válido
  const isTokenValid = (): boolean => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry) {
      return false;
    }
    
    const now = new Date().getTime();
    const expiryTime = parseInt(tokenExpiry);
    
    return now < expiryTime;
  };

  // Função para verificar expiração do token
  const checkTokenExpiry = (): void => {
    if (!isTokenValid()) {
      logout(false); // Logout local apenas, sem chamar API
    }
  };

  // Função para restaurar sessão baseada no token
  const restoreSession = async (): Promise<void> => {
    setIsLoading(true);
    
    if (isTokenValid()) {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao restaurar sessão:', error);
          logout(false);
        }
      }
    } else {
      logout(false);
    }
    
    setIsLoading(false);
  };

  // Verificar se existe token armazenado ao inicializar
  useEffect(() => {
    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Verificar token periodicamente (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Mapear role da API para type do sistema
      const mapRoleToType = (role: string): UserType => {
        switch (role.toLowerCase()) {
          case 'client':
            return 'client';
          case 'accountant':
          case 'contabilista':
            return 'accountant';
          case 'admin':
          case 'administrator':
            return 'admin';
          default:
            return 'client'; // default para client
        }
      };

      // Mock de empresas para demonstração (em produção viria da API)
      const mockCompanies: Company[] = [
        { id: '1', name: 'Tech Solutions Lda', nipc: '501234567', status: 'active' },
        { id: '2', name: 'Inovação Digital Unip Lda', nipc: '501234568', status: 'pending' },
        { id: '3', name: 'Consultoria Estratégica SA', nipc: '501234569', status: 'active' },
        { id: '4', name: 'Serviços Gerais Lda', nipc: '501234570', status: 'inactive' },
      ];

      // Criar objeto de utilizador baseado na resposta da API
      const userType = mapRoleToType(data.user.role);
      const userData: User = {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        username: data.user.username,
        type: userType,
        token: data.token,
        avatar: `/avatars/${userType}.jpg`,
      };

      // Adicionar dados específicos baseados no tipo de utilizador
      if (userType === 'client') {
        userData.companies = [mockCompanies[0]]; // Cliente vê sua empresa
      } else if (userType === 'accountant') {
        userData.permissions = ['manage_clients', 'view_reports', 'manage_documents'];
        userData.clientCompanies = mockCompanies.map(c => c.id); // Contabilista vê todas
      } else if (userType === 'admin') {
        userData.permissions = ['full_access', 'view_logs', 'manage_users', 'system_settings'];
        userData.clientCompanies = mockCompanies.map(c => c.id); // Admin vê tudo
      }

      // Armazenar token no localStorage com expiração de 10 dias
      const expiryTime = new Date().getTime() + (10 * 24 * 60 * 60 * 1000); // 10 dias
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (callApi: boolean = false): Promise<void> => {
    if (callApi) {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        console.error('Erro ao fazer logout na API:', error);
        // Continuar com logout local mesmo se a API falhar
      }
    }

    // Sempre limpar dados locais
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const register = async (formData: RegisterFormData): Promise<{ message: string; requestId?: string }> => {
    try {
      console.log('=== DEBUG: Form data received ===');
      console.log('formData.name:', formData.name);
      console.log('formData.username:', formData.username);
      console.log('formData.nif:', formData.nif);
      console.log('formData.email:', formData.email);
      
      // Usar o username fornecido pelo usuário ou gerar um se não fornecido
      let username = formData.username;
      
      if (!username) {
        // Gerar username baseado no nome da empresa com timestamp apenas se não foi fornecido
        const baseUsername = formData.name ? 
          formData.name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '') :
          formData.email?.split('@')[0] || 'user';
        
        // Adicionar timestamp para garantir unicidade
        const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos do timestamp
        username = `${baseUsername}.${timestamp}`;
      }

      console.log('=== Dados de registro sendo enviados ===');
      console.log('formData completo:', formData);
      console.log('NIPC fornecido:', formData.nipc);
      console.log('NIPC será enviado:', !!formData.nipc);
      
      console.log('=== Username que será enviado ===');
      console.log('username:', username);

      // Mapear dados do frontend para o formato correto esperado pelo backend (snake_case)
      const registrationData = {
        // Campos obrigatórios
        username: username,
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        nif: formData.nif || "",
        password: formData.password || "temp123", // Usar a senha fornecida ou temporária
        company_name: formData.name || "",
        trade_name: formData.name || "",
        ...(formData.nipc && { nipc: formData.nipc }), // NIPC opcional - só enviar se fornecido
        
        // Campos de endereço obrigatórios
        address: formData.address || "",
        postal_code: formData.postalCode || "",
        city: formData.city || "",
        
        // Campos de morada fiscal obrigatórios
        fiscal_address: formData.fiscalAddress || formData.address || "",
        fiscal_postal_code: formData.fiscalPostalCode || formData.postalCode || "",
        fiscal_city: formData.fiscalCity || formData.city || "",
        
        country: "Portugal", // Valor padrão
        cae: "00000", // Código de atividade econômica padrão
        legal_form: "Empresário em Nome Individual", // Forma jurídica padrão
        share_capital: 0.00,
        
        // Data de nascimento obrigatória
        date_of_birth: formData.dateOfBirth || "1990-01-01", // Usar data fornecida ou padrão
        
        // Data de constituição obrigatória
        founding_date: formData.foundingDate || new Date().toISOString().split('T')[0],
        
        // Campos de regime obrigatórios
        accounting_regime: formData.accountingRegime || "organizada",
        vat_regime: formData.vatRegime || "isento_art53",
        
        // Atividade empresarial obrigatória
        business_activity: formData.businessActivity || formData.businessType || "Atividade não especificada",
        
        // Número de faturas mensais obrigatório
        monthly_invoices: formData.monthlyDocuments ? parseInt(formData.monthlyDocuments) || 1 : 1,
        
        // Frequência de relatórios obrigatória
        report_frequency: formData.reportFrequency || "trimestral",
        
        registration_date: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
        
        // Campos específicos para novos clientes
        ...(formData.type === 'new-client' && {
          business_type: formData.businessType || "",
          business_type_other: formData.businessTypeOther || "",
          estimated_revenue: formData.estimatedRevenue || "",
          document_delivery: formData.documentDelivery || "",
          invoicing_tool: formData.invoicingTool || "",
          has_activity: formData.hasActivity || "",
          has_social_security: formData.hasSocialSecurity || "",
          has_employees: formData.hasEmployees || "",
          has_debts: formData.hasDebts || "",
          observations: formData.observations || ""
        }),
        
        // Campos específicos para clientes existentes
        ...(formData.type === 'existing-client' && {
          access_type: formData.accessType || ""
        })
      };
      
      console.log('=== Dados finais para envio ao backend ===');
      console.log('registrationData:', registrationData);
      console.log('NIPC no payload:', registrationData.nipc);
      console.log('NIPC está presente:', 'nipc' in registrationData);

      console.log('=== DEBUG: Mapped registration data ===');
      console.log('company_name:', `"${registrationData.company_name}"`);
      console.log('postal_code:', `"${registrationData.postal_code}"`);
      console.log('name:', `"${registrationData.name}"`);
      console.log('username:', `"${registrationData.username}"`);
      console.log('Full object:', registrationData);

      console.log('Sending registration data to backend:', registrationData);

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Erro ao enviar solicitação';
        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      return {
        message: data.message || 'Solicitação enviada com sucesso',
        requestId: data.requestId
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const isAuthenticated = user !== null;

  // Funções de permissão
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || user.type === 'admin';
  };

  const canViewCompany = (companyId: string): boolean => {
    if (!user) return false;
    
    // Admin vê tudo
    if (user.type === 'admin') return true;
    
    // Contabilista vê empresas dos seus clientes
    if (user.type === 'accountant') {
      return user.clientCompanies?.includes(companyId) || false;
    }
    
    // Cliente só vê suas próprias empresas
    if (user.type === 'client') {
      return user.companies?.some(company => company.id === companyId) || false;
    }
    
    return false;
  };

  const getAccessibleCompanies = (): Company[] => {
    if (!user) return [];
    
    // Mock de todas as empresas (em produção viria da API)
    const allCompanies: Company[] = [
      { id: '1', name: 'Tech Solutions Lda', nipc: '501234567', status: 'active' },
      { id: '2', name: 'Inovação Digital Unip Lda', nipc: '501234568', status: 'pending' },
      { id: '3', name: 'Consultoria Estratégica SA', nipc: '501234569', status: 'active' },
      { id: '4', name: 'Serviços Gerais Lda', nipc: '501234570', status: 'inactive' },
    ];
    
    // Cliente só vê suas empresas
    if (user.type === 'client') {
      return user.companies || [];
    }
    
    // Contabilista e Admin veem todas as empresas dos clientes
    if (user.type === 'accountant' || user.type === 'admin') {
      return allCompanies.filter(company => 
        user.clientCompanies?.includes(company.id)
      );
    }
    
    return [];
  };

  const canViewAdminFeatures = (): boolean => {
    return user?.type === 'admin';
  };

  const canManageClients = (): boolean => {
    return user?.type === 'accountant' || user?.type === 'admin';
  };

  const getToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token: getToken(),
      login, 
      logout, 
      register,
      isAuthenticated,
      isLoading,
      hasPermission,
      canViewCompany,
      getAccessibleCompanies,
      canViewAdminFeatures,
      canManageClients,
      isTokenValid,
      checkTokenExpiry
    }}>
      {children}
    </AuthContext.Provider>
  );
};
