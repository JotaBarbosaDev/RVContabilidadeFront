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

export interface RegisterFormData {
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
      console.log('🎯 === DEBUG: Form data received ===');
      console.log('formData completo:', formData);
      
      // Função para limpar e validar dados antes do envio - VERSÃO CORRIGIDA
      const cleanFormData = (data: RegisterFormData) => {
        console.log('🧹 Iniciando limpeza dos dados...');
        
        // === FUNÇÃO AUXILIAR PARA VALIDAR VALORES ===
        const isValidValue = (value: unknown): boolean => {
          if (!value) return false;
          if (typeof value !== 'string') return false;
          
          const trimmed = value.trim();
          if (trimmed === '') return false;
          
          // Filtros para valores inválidos
          const invalidValues = [
            'não disponível', 'nome não disponível', 'email não disponível',
            'telefone não disponível', 'nif não disponível', 'username não disponível',
            'not available', 'n/a', 'na', 'null', 'undefined', 'none', 'vazio',
            'não informado', 'não preenchido', 'sem informação'
          ];
          
          return !invalidValues.some(invalid => 
            trimmed.toLowerCase().includes(invalid.toLowerCase())
          );
        };

        // === CAMPOS OBRIGATÓRIOS (sempre enviar) ===
        const cleanData: Record<string, string | number> = {
          username: data.username || generateUsername(data),
          password: data.password || "temp123",
          legal_form: "Empresário em Nome Individual" // Valor fixo conforme especificação
        };

        console.log('✅ Campos obrigatórios definidos:', Object.keys(cleanData));

        // === MAPEAMENTO COMPLETO DE CAMPOS ===
        const fieldMappings: Record<string, string> = {
          // Dados pessoais
          name: 'name',
          email: 'email', 
          phone: 'phone',
          nif: 'nif',
          dateOfBirth: 'date_of_birth',
          
          // Moradas
          fiscalAddress: 'fiscal_address',
          fiscalPostalCode: 'fiscal_postal_code', 
          fiscalCity: 'fiscal_city',
          address: 'address',
          postalCode: 'postal_code',
          city: 'city',
          country: 'country',
          
          // Empresa
          businessType: 'company_name',
          nipc: 'nipc',
          foundingDate: 'founding_date',
          
          // Configurações
          accountingRegime: 'accounting_regime',
          vatRegime: 'vat_regime',
          businessActivity: 'business_activity',
          reportFrequency: 'report_frequency'
        };

        // === CAMPOS NUMÉRICOS ===
        const numericFields = {
          monthlyDocuments: 'monthly_invoices'
        };

        // === PROCESSAR CAMPOS DE TEXTO ===
        Object.entries(fieldMappings).forEach(([frontendKey, backendKey]) => {
          const value = data[frontendKey as keyof RegisterFormData];
          
          if (isValidValue(value)) {
            cleanData[backendKey] = (value as string).trim();
            console.log(`✅ Campo ${backendKey}: ${value}`);
          } else if (value) {
            console.log(`❌ Campo ${frontendKey} rejeitado: "${value}"`);
          }
        });

        // === PROCESSAR CAMPOS NUMÉRICOS ===
        Object.entries(numericFields).forEach(([frontendKey, backendKey]) => {
          const value = data[frontendKey as keyof RegisterFormData];
          
          if (value !== undefined && value !== null && value !== '') {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue > 0) {
              cleanData[backendKey] = numValue;
              console.log(`✅ Campo numérico ${backendKey}: ${numValue}`);
            }
          }
        });

        // === LÓGICA ESPECIAL PARA DATAS (formato YYYY-MM-DD) ===
        if (data.dateOfBirth && isValidValue(data.dateOfBirth)) {
          const dateStr = data.dateOfBirth.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            cleanData.date_of_birth = dateStr;
          }
        }

        if (data.foundingDate && isValidValue(data.foundingDate)) {
          const dateStr = data.foundingDate.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            cleanData.founding_date = dateStr;
          }
        }

        console.log('🎯 Dados finais limpos:', Object.keys(cleanData));
        console.log('📊 Total de campos:', Object.keys(cleanData).length);
        
        return cleanData;
      };

      // Função para gerar username se não fornecido
      const generateUsername = (data: RegisterFormData): string => {
        if (data.username && data.username.trim()) {
          return data.username.trim();
        }

        const baseUsername = data.name ? 
          data.name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '') :
          data.email?.split('@')[0] || 'user';
        
        const timestamp = Date.now().toString().slice(-6);
        return `${baseUsername}.${timestamp}`;
      };

      // Limpar dados antes do envio
      const cleanedData = cleanFormData(formData);
      
      console.log('🎯 === RESUMO FINAL DO ENVIO ===');
      console.log('📤 Endpoint:', 'http://localhost:8080/api/auth/register');
      console.log('📋 Dados a enviar:', JSON.stringify(cleanedData, null, 2));
      console.log('🔢 Total de campos:', Object.keys(cleanedData).length);
      console.log('📝 Campos incluídos:', Object.keys(cleanedData).join(', '));
      
      // Validação final antes do envio
      if (!cleanedData.username || !cleanedData.password || !cleanedData.legal_form) {
        throw new Error('Campos obrigatórios em falta: username, password, legal_form');
      }

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorMessage = 'Erro ao enviar solicitação';
        try {
          const errorData = await response.json();
          console.log('❌ Erro do backend:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.log('❌ Não foi possível parsear erro do backend:', parseError);
          const textError = await response.text();
          console.log('❌ Resposta de erro (texto):', textError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Resposta de sucesso:', data);
      console.log('✅ Registro criado com ID:', data.data?.id);
      
      return {
        message: data.message || 'Solicitação enviada com sucesso',
        requestId: data.data?.id || data.requestId
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
