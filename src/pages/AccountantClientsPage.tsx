import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  Building,
  Mail,
  Phone,
  RefreshCw
} from 'lucide-react';

interface ClientRequest {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  username?: string;
  phone: string;
  nif: string;
  address?: string;
  postal_code?: string;
  city?: string;
  status?: 'approved' | 'pending' | 'rejected' | 'blocked';
  company_name?: string;
  nipc?: string;
  created_at: string;
  updated_at?: string;
  date_of_birth?: string;
  fiscal_address?: string;
  fiscal_postal_code?: string;
  fiscal_city?: string;
  cae?: string;
  legal_form?: string;
  founding_date?: string;
  accounting_regime?: string;
  vat_regime?: string;
  business_activity?: string;
  estimated_revenue?: number;
  monthly_invoices?: number;
  number_employees?: number;
  report_frequency?: string;
  has_company?: boolean;
  marital_status?: string;
  citizen_card_number?: string;
  trade_name?: string;
  annual_revenue?: number;
  main_clients?: string;
  main_suppliers?: string;
}

interface ClientStats {
  total_clients: number;
  approved_clients: number;
  pending_clients: number;
  rejected_clients: number;
  blocked_clients: number;
  clients_with_company: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  nif: string;
  address?: string;
  postal_code?: string;
  city?: string;
  status: 'approved' | 'pending' | 'rejected' | 'blocked';
  role: 'client' | 'accountant' | 'admin';
  company_name?: string;
  nipc?: string;
  created_at: string;
  updated_at: string;
  // Campos expandidos baseados no registo estendido
  date_of_birth?: string;
  fiscal_address?: string;
  fiscal_postal_code?: string;
  fiscal_city?: string;
  cae?: string;
  legal_form?: string;
  founding_date?: string;
  accounting_regime?: string;
  vat_regime?: string;
  business_activity?: string;
  estimated_revenue?: number;
  monthly_invoices?: number;
  number_employees?: number;
  report_frequency?: string;
  has_company?: boolean;
  // Dados adicionais do perfil
  marital_status?: string;
  citizen_card_number?: string;
  trade_name?: string;
  annual_revenue?: number;
  main_clients?: string;
  main_suppliers?: string;
}

interface ClientProfileFormData {
  // Dados pessoais básicos
  name: string;
  email: string;
  phone: string;
  nif: string;
  date_of_birth: string;
  marital_status: string;
  citizen_card_number: string;
  
  // Morada
  address: string;
  postal_code: string;
  city: string;
  
  // Morada fiscal (se diferente)
  fiscal_address: string;
  fiscal_postal_code: string;
  fiscal_city: string;
  
  // Dados da empresa
  has_company: boolean;
  company_name: string;
  trade_name: string;
  nipc: string;
  cae: string;
  legal_form: string;
  founding_date: string;
  business_activity: string;
  
  // Regime contabilístico e fiscal
  accounting_regime: string;
  vat_regime: string;
  
  // Dados financeiros e operacionais
  estimated_revenue: number;
  annual_revenue: number;
  monthly_invoices: number;
  number_employees: number;
  main_clients: string;
  main_suppliers: string;
  
  // Relatórios
  report_frequency: string;
  
  // Credenciais (apenas para contabilistas/admins)
  username: string;
  password: string;
  new_password: string;
  confirm_password: string;
  
  // Status
  status: 'approved' | 'pending' | 'rejected' | 'blocked';
}

export default function AccountantClientsPage() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    total_clients: 0,
    approved_clients: 0,
    pending_clients: 0,
    rejected_clients: 0,
    blocked_clients: 0,
    clients_with_company: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'blocked'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState<ClientProfileFormData>({
    // Dados pessoais básicos
    name: '',
    email: '',
    phone: '',
    nif: '',
    date_of_birth: '',
    marital_status: '',
    citizen_card_number: '',
    
    // Morada
    address: '',
    postal_code: '',
    city: '',
    
    // Morada fiscal (se diferente)
    fiscal_address: '',
    fiscal_postal_code: '',
    fiscal_city: '',
    
    // Dados da empresa
    has_company: false,
    company_name: '',
    trade_name: '',
    nipc: '',
    cae: '',
    legal_form: '',
    founding_date: '',
    business_activity: '',
    
    // Regime contabilístico e fiscal
    accounting_regime: '',
    vat_regime: '',
    
    // Dados financeiros e operacionais
    estimated_revenue: 0,
    annual_revenue: 0,
    monthly_invoices: 0,
    number_employees: 0,
    main_clients: '',
    main_suppliers: '',
    
    // Relatórios
    report_frequency: '',
    
    // Credenciais (apenas para contabilistas/admins)
    username: '',
    password: '',
    new_password: '',
    confirm_password: '',
    
    // Status
    status: 'pending'
  });

  const breadcrumb = {
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Gestão de Clientes" },
    ]
  };

  const calculateStats = (clientList: Client[]): ClientStats => {
    console.log('Calculating stats for clients:', clientList);
    const stats = {
      total_clients: clientList.length,
      approved_clients: clientList.filter(c => c.status === 'approved').length,
      pending_clients: clientList.filter(c => c.status === 'pending').length,
      rejected_clients: clientList.filter(c => c.status === 'rejected').length,
      blocked_clients: clientList.filter(c => c.status === 'blocked').length,
      clients_with_company: clientList.filter(c => 
        c.has_company === true || 
        (c.company_name && c.company_name.trim() !== '') ||
        (c.nipc && c.nipc.trim() !== '')
      ).length
    };
    console.log('Stats calculated:', stats);
    return stats;
  };

  const fetchClientsFallback = useCallback(async () => {
    console.log('🔄 Using fallback endpoints...');
    
    // Primeiro, tentar o endpoint de dashboard que pode ter dados consolidados
    let response = await fetch('http://localhost:8080/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('📊 Dashboard API Response:', result);
      
      if (result.success && result.data && result.data.pending_requests) {
        const requestsList = result.data.pending_requests;
        
        // Converter para formato de clientes
        const clientsList = requestsList.map((request: ClientRequest) => ({
          id: request.id,
          name: request.name || request.full_name,
          email: request.email,
          username: request.username || request.email,
          phone: request.phone,
          nif: request.nif,
          address: request.address,
          postal_code: request.postal_code,
          city: request.city,
          status: request.status || 'pending',
          role: 'client' as const,
          company_name: request.company_name,
          nipc: request.nipc,
          created_at: request.created_at,
          updated_at: request.updated_at,
          date_of_birth: request.date_of_birth,
          fiscal_address: request.fiscal_address,
          fiscal_postal_code: request.fiscal_postal_code,
          fiscal_city: request.fiscal_city,
          cae: request.cae,
          legal_form: request.legal_form,
          founding_date: request.founding_date,
          accounting_regime: request.accounting_regime,
          vat_regime: request.vat_regime,
          business_activity: request.business_activity,
          estimated_revenue: request.estimated_revenue,
          monthly_invoices: request.monthly_invoices,
          number_employees: request.number_employees,
          report_frequency: request.report_frequency,
          has_company: request.has_company,
          marital_status: request.marital_status,
          citizen_card_number: request.citizen_card_number,
          trade_name: request.trade_name,
          annual_revenue: request.annual_revenue,
          main_clients: request.main_clients,
          main_suppliers: request.main_suppliers,
        }));
        
        console.log('✅ Dashboard data loaded successfully:', clientsList.length);
        setClients(clientsList);
        
        // Usar stats do dashboard se disponível
        if (result.data.stats) {
          setStats(result.data.stats);
        } else {
          const calculatedStats = calculateStats(clientsList);
          setStats(calculatedStats);
        }
        
        return true;
      }
    }
    
    // Se o dashboard não funcionar, usar o endpoint original
    console.log('🔄 Using original fallback endpoint: /api/admin/users?role=client');
    response = await fetch('http://localhost:8080/api/admin/users?role=client', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('👥 Fallback API Response:', result);
      if (result.success && result.data) {
        const clientsList = result.data.users || [];
        setClients(clientsList);
        
        const apiStats = result.data.stats;
        const hasValidStats = apiStats && (
          apiStats.total_clients > 0 || 
          apiStats.approved_clients > 0 || 
          apiStats.pending_clients > 0 || 
          apiStats.rejected_clients > 0 || 
          apiStats.blocked_clients > 0 || 
          apiStats.clients_with_company > 0
        );
        
        if (hasValidStats) {
          setStats(apiStats);
        } else {
          const calculatedStats = calculateStats(clientsList);
          setStats(calculatedStats);
        }
        return true;
      }
    }
    
    console.error('❌ All fallback endpoints failed');
    setClients([]);
    return false;
  }, [token]);

  const fetchClientsData = useCallback(async () => {
    console.log('🔍 Fetching clients data for accountant...');
    console.log('🔑 Token present:', !!token);
    console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    // Primeiro, tentar buscar solicitações pendentes específicas
    let response = await fetch('http://localhost:8080/api/admin/pending-requests', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Pending requests response status:', response.status);
    
    // Se não funcionar, tentar o endpoint geral de requests
    if (!response.ok) {
      console.log('🔄 Trying general requests endpoint...');
      response = await fetch('http://localhost:8080/api/admin/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 General requests response status:', response.status);
    }

    console.log('📡 Final response ok:', response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response:', result); // Debug log
      console.log('✅ API Response type:', typeof result);
      console.log('✅ API Response keys:', Object.keys(result));
      
      if (result.success || Array.isArray(result)) {
        // Verificar se é uma lista de requests diretamente ou dentro de uma propriedade
        let requestsList = [];
        
        if (Array.isArray(result)) {
          // Se result é um array direto de requests
          requestsList = result;
          console.log('📋 Direct array of requests:', requestsList.length);
          console.log('📋 First request sample:', requestsList[0]);
        } else if (result.data && Array.isArray(result.data)) {
          // Se result.data é um array de requests
          requestsList = result.data;
          console.log('📋 Requests from result.data:', requestsList.length);
          console.log('📋 First request sample:', requestsList[0]);
        } else if (result.requests && Array.isArray(result.requests)) {
          // Se result.requests é um array de requests
          requestsList = result.requests;
          console.log('📋 Requests from result.requests:', requestsList.length);
          console.log('📋 First request sample:', requestsList[0]);
        } else {
          console.log('❌ Unexpected data format:', result);
          console.log('❌ Result structure:');
          if (result.data) {
            console.log('  - result.data:', result.data);
            console.log('  - result.data type:', typeof result.data);
            console.log('  - result.data keys:', Object.keys(result.data));
          }
          return await fetchClientsFallback();
        }
        
        // Converter requests para formato de clientes
        console.log('🔄 Converting requests to clients format...');
        const clientsList = requestsList.map((request: ClientRequest, index: number) => {
          console.log(`📄 Processing request ${index + 1}:`, {
            id: request.id,
            name: request.name,
            full_name: request.full_name,
            email: request.email,
            phone: request.phone,
            nif: request.nif,
            status: request.status
          });
          
          return {
            id: request.id,
            name: request.name || request.full_name || 'Nome não disponível',
            email: request.email || 'Email não disponível',
            username: request.username || request.email || 'Username não disponível',
            phone: request.phone || 'Telefone não disponível',
            nif: request.nif || 'NIF não disponível',
            address: request.address,
            postal_code: request.postal_code,
            city: request.city,
            status: request.status || 'pending',
            role: 'client',
            company_name: request.company_name,
            nipc: request.nipc,
            created_at: request.created_at || new Date().toISOString(),
            updated_at: request.updated_at || new Date().toISOString(),
            // Outros campos específicos do request
            date_of_birth: request.date_of_birth,
            fiscal_address: request.fiscal_address,
            fiscal_postal_code: request.fiscal_postal_code,
            fiscal_city: request.fiscal_city,
            cae: request.cae,
            legal_form: request.legal_form,
            founding_date: request.founding_date,
            accounting_regime: request.accounting_regime,
            vat_regime: request.vat_regime,
            business_activity: request.business_activity,
            estimated_revenue: request.estimated_revenue,
            monthly_invoices: request.monthly_invoices,
            number_employees: request.number_employees,
            report_frequency: request.report_frequency,
            has_company: request.has_company,
            marital_status: request.marital_status,
            citizen_card_number: request.citizen_card_number,
            trade_name: request.trade_name,
            annual_revenue: request.annual_revenue,
            main_clients: request.main_clients,
            main_suppliers: request.main_suppliers,
          };
        });
        
        console.log('👥 Converted clients list:', clientsList.length);
        setClients(clientsList);
        
        // Calcular stats baseado na lista de clientes
        const calculatedStats = calculateStats(clientsList);
        console.log('📊 Calculated stats:', calculatedStats);
        setStats(calculatedStats);
        
        return true;
      } else {
        console.log('❌ No success or data in response, trying fallback...');
        return await fetchClientsFallback();
      }
    } else {
      console.error('❌ Error loading clients:', response.status);
      console.log('🔄 Trying fallback endpoint...');
      return await fetchClientsFallback();
    }
  }, [token, fetchClientsFallback]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        await fetchClientsData();
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadClients();
    }
  }, [token, fetchClientsData]);

  const refreshClients = async () => {
    setIsLoading(true);
    try {
      const success = await fetchClientsData();
      if (success) {
        addToast({
          title: "Dados atualizados",
          description: "Lista de clientes e estatísticas foram atualizadas com sucesso.",
          type: "success",
        });
      } else {
        addToast({
          title: "Erro",
          description: "Não foi possível carregar os dados dos clientes.",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClients([]);
      addToast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao carregar os dados.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleViewClientProfile = (client: Client) => {
    setSelectedClient(client);
    setProfileFormData({
      // Dados pessoais básicos
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      nif: client.nif || '',
      date_of_birth: client.date_of_birth || '',
      marital_status: client.marital_status || '',
      citizen_card_number: client.citizen_card_number || '',
      
      // Morada
      address: client.address || '',
      postal_code: client.postal_code || '',
      city: client.city || '',
      
      // Morada fiscal (se diferente)
      fiscal_address: client.fiscal_address || '',
      fiscal_postal_code: client.fiscal_postal_code || '',
      fiscal_city: client.fiscal_city || '',
      
      // Dados da empresa
      has_company: client.has_company || false,
      company_name: client.company_name || '',
      trade_name: client.trade_name || '',
      nipc: client.nipc || '',
      cae: client.cae || '',
      legal_form: client.legal_form || '',
      founding_date: client.founding_date || '',
      business_activity: client.business_activity || '',
      
      // Regime contabilístico e fiscal
      accounting_regime: client.accounting_regime || '',
      vat_regime: client.vat_regime || '',
      
      // Dados financeiros e operacionais
      estimated_revenue: client.estimated_revenue || 0,
      annual_revenue: client.annual_revenue || 0,
      monthly_invoices: client.monthly_invoices || 0,
      number_employees: client.number_employees || 0,
      main_clients: client.main_clients || '',
      main_suppliers: client.main_suppliers || '',
      
      // Relatórios
      report_frequency: client.report_frequency || '',
      
      // Credenciais (apenas para contabilistas/admins)
      username: client.username || client.email || '', // usar username se disponível, senão email
      password: '',
      new_password: '',
      confirm_password: '',
      
      // Status
      status: client.status
    });
    setIsProfileModalOpen(true);
  };

  const saveClientProfile = async () => {
    if (!selectedClient) return;

    try {
      // Validar passwords se estiver a alterar
      if (profileFormData.new_password) {
        if (profileFormData.new_password !== profileFormData.confirm_password) {
          addToast({
            title: "Erro",
            description: "As passwords não coincidem.",
            type: "error"
          });
          return;
        }
        if (profileFormData.new_password.length < 6) {
          addToast({
            title: "Erro",
            description: "A password deve ter pelo menos 6 caracteres.",
            type: "error"
          });
          return;
        }
      }

      // Preparar dados para update
      const updateData: Record<string, unknown> = {
        name: profileFormData.name,
        email: profileFormData.email,
        phone: profileFormData.phone,
        nif: profileFormData.nif,
        date_of_birth: profileFormData.date_of_birth,
        marital_status: profileFormData.marital_status,
        citizen_card_number: profileFormData.citizen_card_number,
        address: profileFormData.address,
        postal_code: profileFormData.postal_code,
        city: profileFormData.city,
        fiscal_address: profileFormData.fiscal_address,
        fiscal_postal_code: profileFormData.fiscal_postal_code,
        fiscal_city: profileFormData.fiscal_city,
        has_company: profileFormData.has_company,
        company_name: profileFormData.company_name,
        trade_name: profileFormData.trade_name,
        nipc: profileFormData.nipc,
        cae: profileFormData.cae,
        legal_form: profileFormData.legal_form,
        founding_date: profileFormData.founding_date,
        business_activity: profileFormData.business_activity,
        accounting_regime: profileFormData.accounting_regime,
        vat_regime: profileFormData.vat_regime,
        estimated_revenue: profileFormData.estimated_revenue,
        annual_revenue: profileFormData.annual_revenue,
        monthly_invoices: profileFormData.monthly_invoices,
        number_employees: profileFormData.number_employees,
        main_clients: profileFormData.main_clients,
        main_suppliers: profileFormData.main_suppliers,
        report_frequency: profileFormData.report_frequency,
        status: profileFormData.status
      };

      // Adicionar password se estiver a alterar
      if (profileFormData.new_password) {
        updateData.password = profileFormData.new_password;
      }

      const response = await fetch(`http://localhost:8080/api/admin/users/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await refreshClients();
          setIsProfileModalOpen(false);
          setSelectedClient(null);
          addToast({
            title: "Sucesso",
            description: "Perfil do cliente atualizado com sucesso!",
            type: "success"
          });
        } else {
          throw new Error(result.message || 'Erro ao atualizar perfil do cliente');
        }
      } else {
        throw new Error('Erro ao atualizar perfil do cliente');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil do cliente:', error);
      addToast({
        title: "Erro",
        description: "Erro ao atualizar perfil do cliente. Tente novamente.",
        type: "error"
      });
    }
  };

  const confirmDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${selectedClient.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await refreshClients();
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
          addToast({
            type: 'success',
            title: 'Cliente eliminado',
            description: 'Cliente eliminado com sucesso!'
          });
        } else {
          throw new Error(result.message || 'Erro ao eliminar cliente');
        }
      } else {
        throw new Error('Erro ao eliminar cliente');
      }
    } catch (error) {
      console.error('Erro ao eliminar cliente:', error);
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Erro ao eliminar cliente. Tente novamente.'
      });
    }
  };

  const filteredClients = clients.filter((client: Client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.username && client.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.nif.includes(searchTerm) ||
      (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case 'blocked':
        return <Badge variant="destructive" className="bg-red-500 text-white">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb={breadcrumb}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accounting-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumb={breadcrumb}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os users aprovados (seus clientes) e os seus dados
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={refreshClients}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas dos Clientes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_clients}</div>
              <p className="text-xs text-muted-foreground">
                Todos os clientes registados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                {stats.approved_clients}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved_clients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes ativos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
                {stats.pending_clients}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_clients}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Empresa</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clients_with_company}</div>
              <p className="text-xs text-muted-foreground">
                Clientes empresariais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, email, NIF ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('approved')}
                >
                  Aprovados
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pendentes
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('rejected')}
                >
                  Rejeitados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes ({filteredClients.length})</CardTitle>
            <CardDescription>
              Lista de todos os clientes filtrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Nenhum cliente encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar os filtros ou termos de pesquisa.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div 
                      className="flex items-center space-x-4 flex-1" 
                      onClick={() => handleViewClientProfile(client)}
                    >
                      <div className="bg-accounting-primary/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-accounting-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{client.name}</h4>
                          {getStatusBadge(client.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {client.username && client.username !== client.email && (
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">Username:</span>
                              <span>{client.username}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                          {client.company_name && (
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{client.company_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewClientProfile(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Ver/Editar Perfil Completo
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClient(client)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Client Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Cliente</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja eliminar o cliente <strong>{selectedClient?.name}</strong>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteClient}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Client Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Perfil Completo do Cliente</DialogTitle>
              <DialogDescription>
                Visualizar e editar todos os dados do cliente {selectedClient?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedClient && (
              <div className="space-y-6 py-4">
                {/* Dados Pessoais Básicos */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-name">Nome Completo</Label>
                      <Input
                        id="profile-name"
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileFormData.email}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-phone">Telefone</Label>
                      <Input
                        id="profile-phone"
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-nif">NIF</Label>
                      <Input
                        id="profile-nif"
                        value={profileFormData.nif}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, nif: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-birth-date">Data de Nascimento</Label>
                      <Input
                        id="profile-birth-date"
                        type="date"
                        value={profileFormData.date_of_birth}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-marital-status">Estado Civil</Label>
                      <Select value={profileFormData.marital_status} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, marital_status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro(a)">Solteiro(a)</SelectItem>
                          <SelectItem value="casado(a)">Casado(a)</SelectItem>
                          <SelectItem value="divorciado(a)">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo(a)">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao_facto">União de Facto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="profile-citizen-card">Número do Cartão de Cidadão</Label>
                      <Input
                        id="profile-citizen-card"
                        value={profileFormData.citizen_card_number}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, citizen_card_number: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Morada */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Morada de Residência</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="profile-address">Morada</Label>
                      <Input
                        id="profile-address"
                        value={profileFormData.address}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-postal-code">Código Postal</Label>
                      <Input
                        id="profile-postal-code"
                        value={profileFormData.postal_code}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-city">Cidade</Label>
                      <Input
                        id="profile-city"
                        value={profileFormData.city}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Morada Fiscal */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Morada Fiscal (se diferente)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="profile-fiscal-address">Morada Fiscal</Label>
                      <Input
                        id="profile-fiscal-address"
                        value={profileFormData.fiscal_address}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_address: e.target.value }))}
                        placeholder="Deixar vazio se igual à morada de residência"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-fiscal-postal-code">Código Postal Fiscal</Label>
                      <Input
                        id="profile-fiscal-postal-code"
                        value={profileFormData.fiscal_postal_code}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_postal_code: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-fiscal-city">Cidade Fiscal</Label>
                      <Input
                        id="profile-fiscal-city"
                        value={profileFormData.fiscal_city}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, fiscal_city: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Dados da Empresa */}
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="profile-has-company"
                      checked={profileFormData.has_company}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, has_company: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="profile-has-company" className="text-lg font-semibold">
                      Tem Empresa
                    </Label>
                  </div>
                  
                  {profileFormData.has_company && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profile-company-name">Nome da Empresa</Label>
                        <Input
                          id="profile-company-name"
                          value={profileFormData.company_name}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-trade-name">Nome Comercial</Label>
                        <Input
                          id="profile-trade-name"
                          value={profileFormData.trade_name}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, trade_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-nipc">NIPC</Label>
                        <Input
                          id="profile-nipc"
                          value={profileFormData.nipc}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, nipc: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-cae">CAE</Label>
                        <Input
                          id="profile-cae"
                          value={profileFormData.cae}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, cae: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-legal-form">Forma Legal</Label>
                        <Select value={profileFormData.legal_form} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, legal_form: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar forma legal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unipessoal">Empresário em Nome Individual</SelectItem>
                            <SelectItem value="lda">Sociedade por Quotas (Lda.)</SelectItem>
                            <SelectItem value="sa">Sociedade Anónima (SA)</SelectItem>
                            <SelectItem value="sus">Sociedade Unipessoal por Quotas (SUS)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="profile-founding-date">Data de Constituição</Label>
                        <Input
                          id="profile-founding-date"
                          type="date"
                          value={profileFormData.founding_date}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, founding_date: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="profile-business-activity">Atividade Empresarial</Label>
                        <Textarea
                          id="profile-business-activity"
                          value={profileFormData.business_activity}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, business_activity: e.target.value }))}
                          placeholder="Descreva a atividade principal da empresa"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Regime Contabilístico e Fiscal */}
                {profileFormData.has_company && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Regime Contabilístico e Fiscal</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profile-accounting-regime">Regime Contabilístico</Label>
                        <Select value={profileFormData.accounting_regime} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, accounting_regime: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar regime" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simplificado">Regime Simplificado</SelectItem>
                            <SelectItem value="geral">Regime Geral</SelectItem>
                            <SelectItem value="micro">Regime dos Micro Entidades</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="profile-vat-regime">Regime de IVA</Label>
                        <Select value={profileFormData.vat_regime} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, vat_regime: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar regime IVA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Regime Normal</SelectItem>
                            <SelectItem value="simplificado">Regime Simplificado</SelectItem>
                            <SelectItem value="isento">Isento</SelectItem>
                            <SelectItem value="trimestral">Regime Trimestral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dados Financeiros */}
                {profileFormData.has_company && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Dados Financeiros e Operacionais</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profile-estimated-revenue">Faturação Estimada (€)</Label>
                        <Input
                          id="profile-estimated-revenue"
                          type="number"
                          value={profileFormData.estimated_revenue}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, estimated_revenue: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-annual-revenue">Faturação Anual (€)</Label>
                        <Input
                          id="profile-annual-revenue"
                          type="number"
                          value={profileFormData.annual_revenue}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, annual_revenue: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-monthly-invoices">Nº Faturas/Mês</Label>
                        <Input
                          id="profile-monthly-invoices"
                          type="number"
                          value={profileFormData.monthly_invoices}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, monthly_invoices: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-employees">Nº Funcionários</Label>
                        <Input
                          id="profile-employees"
                          type="number"
                          value={profileFormData.number_employees}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, number_employees: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="profile-main-clients">Principais Clientes</Label>
                        <Textarea
                          id="profile-main-clients"
                          value={profileFormData.main_clients}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, main_clients: e.target.value }))}
                          placeholder="Descrição dos principais clientes ou sectores"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="profile-main-suppliers">Principais Fornecedores</Label>
                        <Textarea
                          id="profile-main-suppliers"
                          value={profileFormData.main_suppliers}
                          onChange={(e) => setProfileFormData(prev => ({ ...prev, main_suppliers: e.target.value }))}
                          placeholder="Descrição dos principais fornecedores"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Relatórios */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Relatórios</h3>
                  <div>
                    <Label htmlFor="profile-report-frequency">Frequência de Relatórios</Label>
                    <Select value={profileFormData.report_frequency} onValueChange={(value) => setProfileFormData(prev => ({ ...prev, report_frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Credenciais e Status */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">Credenciais e Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-username">Username</Label>
                      <Input
                        id="profile-username"
                        value={profileFormData.username}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, username: e.target.value }))}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-status">Status</Label>
                      <Select value={profileFormData.status} onValueChange={(value: 'approved' | 'pending' | 'rejected' | 'blocked') => setProfileFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                          <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profile-new-password">Nova Password (opcional)</Label>
                      <Input
                        id="profile-new-password"
                        type="password"
                        value={profileFormData.new_password}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, new_password: e.target.value }))}
                        placeholder="Deixar vazio para manter atual"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-confirm-password">Confirmar Nova Password</Label>
                      <Input
                        id="profile-confirm-password"
                        type="password"
                        value={profileFormData.confirm_password}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                        placeholder="Confirmar apenas se alterar password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveClientProfile}>
                Guardar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
