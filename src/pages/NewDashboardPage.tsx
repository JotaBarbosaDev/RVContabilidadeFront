import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAdmin } from "@/hooks/useAdmin"
import { 
  Building,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  Upload,
  Users,
  Activity,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Check,
  X
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"

interface ClientSummary {
  name: string;
  email: string;
  username?: string;
  status: string;
  nipc: string;
}

interface DashboardStats {
  totalClients: number;
  pendingRequests: number;
  approvedClients: number;
  rejectedClients: number;
  totalRevenue?: number;
  pendingObligations?: number;
}

export default function NewDashboardPage() {
  const { user, getAccessibleCompanies, token } = useAuth();
  const adminContext = useAdmin();
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  // Estado inicial vazio - apenas dados reais da BD
  const [recentClients, setRecentClients] = useState<ClientSummary[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingRequests: 0,
    approvedClients: 0,
    rejectedClients: 0,
    totalRevenue: 0,
    pendingObligations: 0
  });
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const hasInitialized = useRef(false);

  // Função para carregar estatísticas do dashboard usando endpoint complete-users-overview
  const loadDashboardStats = useCallback(async () => {
    if (!token) {
      console.log('❌ Token não disponível para carregar estatísticas');
      return;
    }
    
    console.log('🔍 === CARREGANDO ESTATÍSTICAS DO DASHBOARD (ENDPOINT COMPLETE-USERS-OVERVIEW) ===');
    setIsLoadingStats(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/admin/complete-users-overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Complete users overview response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ COMPLETE USERS OVERVIEW RESULT:', JSON.stringify(result, null, 2));
        
        // O endpoint retorna um array de usuários em result.data
        const users = result.data || [];
        console.log('👥 Total de usuários encontrados:', users.length);
        
        // Contar usuários por status
        const approvedUsers = users.filter((user: Record<string, unknown>) => user.status === 'approved');
        const pendingUsers = users.filter((user: Record<string, unknown>) => user.status === 'pending');
        const rejectedUsers = users.filter((user: Record<string, unknown>) => user.status === 'rejected');
        const blockedUsers = users.filter((user: Record<string, unknown>) => user.status === 'blocked');
        
        // Contar apenas clientes aprovados (não incluir admin/accountant)
        const approvedClients = approvedUsers.filter((user: Record<string, unknown>) => user.role === 'client');
        const allClients = users.filter((user: Record<string, unknown>) => user.role === 'client');
        
        console.log('📊 Contagem por status:', {
          'Total usuários': users.length,
          'Total clientes (todos)': allClients.length,
          'Clientes aprovados': approvedClients.length,
          'Usuários aprovados (todos)': approvedUsers.length,
          'Usuários pendentes': pendingUsers.length,
          'Usuários rejeitados': rejectedUsers.length,
          'Usuários bloqueados': blockedUsers.length
        });
        
        // Extrair as estatísticas do endpoint
        const stats = {
          totalClients: allClients.length, // Total de clientes (todos os status)
          pendingRequests: pendingUsers.length, // Todos os pending
          approvedClients: approvedClients.length, // Apenas clientes aprovados
          rejectedClients: rejectedUsers.length, // Todos os rejeitados
          blockedClients: blockedUsers.length, // Todos os bloqueados
          totalRevenue: 0, // Pode ser adicionado no futuro pelo backend
          pendingObligations: 0 // Pode ser adicionado no futuro pelo backend
        };
        
        console.log('📊 Estatísticas finais do dashboard:', {
          totalClientes: stats.totalClients,
          clientesAprovados: stats.approvedClients,
          pedidosPendentes: stats.pendingRequests,
          rejeitados: stats.rejectedClients,
          bloqueados: stats.blockedClients
        });
        
        setDashboardStats(stats);
        setIsLoadingStats(false);
        return;
      } else {
        const errorText = await response.text();
        console.log('❌ Complete users overview error:', errorText);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas do dashboard:', error);
    }
    
    // Se falhou, manter valores zerados
    console.log('❌ Não foi possível carregar estatísticas - usando valores padrão');
    const defaultStats = {
      totalClients: 0,
      pendingRequests: 0,
      approvedClients: 0,
      rejectedClients: 0,
      blockedClients: 0,
      totalRevenue: 0,
      pendingObligations: 0
    };
    
    setDashboardStats(defaultStats);
    setIsLoadingStats(false);
  }, [token]);

  // Função para carregar clientes recentes usando o mesmo endpoint complete-users-overview
  const loadRecentClients = useCallback(async () => {
    if (!token) {
      console.log('❌ Token não disponível para carregar clientes');
      return;
    }
    
    console.log('🔍 === CARREGANDO CLIENTES RECENTES (ENDPOINT COMPLETE-USERS-OVERVIEW) ===');
    setIsLoadingClients(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/admin/complete-users-overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Status da resposta: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resposta da API (clientes recentes):', result);
        
        // O endpoint retorna um array de usuários em result.data
        const users = result.data || [];
        console.log('👥 Total de usuários encontrados:', users.length);
        
        // Filtrar apenas clientes aprovados
        const approvedClients = users.filter((user: Record<string, unknown>) => 
          user.role === 'client' && user.status === 'approved'
        );
        
        console.log('✅ Clientes aprovados encontrados:', approvedClients.length);
        
        if (approvedClients.length > 0) {
          // Processar clientes aprovados - pegar os 4 mais recentes
          const processedClients = approvedClients
            .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
              const dateA = new Date(a.user_created_at as string || a.user_updated_at as string || 0).getTime();
              const dateB = new Date(b.user_created_at as string || b.user_updated_at as string || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 4) // Últimos 4 clientes aprovados
            .map((client: Record<string, unknown>) => ({
              name: client.company_name || client.name || 'Nome não disponível',
              email: client.email || 'Email não disponível',
              username: client.username || '',
              status: 'Aprovado', // Todos são aprovados por causa do filtro
              nipc: client.nipc || 'N/A'
            }));
          
          console.log('✅ Clientes recentes processados:', processedClients.length);
          console.log('📋 Dados dos clientes recentes:', processedClients);
          setRecentClients(processedClients);
        } else {
          console.log('⚠️ Nenhum cliente aprovado encontrado');
          setRecentClients([]);
        }
      } else {
        console.log(`❌ Erro na resposta: Status ${response.status}`);
        const errorText = await response.text();
        console.log('❌ Detalhes do erro:', errorText);
        setRecentClients([]);
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      setRecentClients([]);  
    } finally {
      setIsLoadingClients(false);
    }
  }, [token]);

  // UseEffect para inicializar os dados
  useEffect(() => {
    console.log('🔍 Dashboard useEffect - User type:', user?.type);
    console.log('🔍 Dashboard useEffect - Admin context available:', !!adminContext?.fetchPendingRequests);
    console.log('🔍 Dashboard useEffect - Pending requests:', adminContext?.pendingRequests?.length || 0);
    
    if ((user?.type === 'accountant' || user?.type === 'admin') && token && !hasInitialized.current) {
      console.log(`✅ Inicializando dashboard para ${user.type}...`);
      hasInitialized.current = true;
      
      // Executar as chamadas de dados
      if (adminContext?.fetchPendingRequests) {
        adminContext.fetchPendingRequests();
      }
      loadRecentClients();
      loadDashboardStats();
    }
  }, [user?.type, adminContext, token, loadRecentClients, loadDashboardStats]);

  // Função para aprovar/rejeitar pedidos
  const handleApproveRequest = async (requestId: string, approved: boolean) => {
    const action = approved ? 'aprovar' : 'rejeitar';
    const confirmMessage = `Tem certeza que deseja ${action} este pedido?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setProcessingRequest(requestId);
    try {
      if (adminContext?.approveRequest) {
        await adminContext.approveRequest(requestId, approved);
        // Mostrar feedback de sucesso
        alert(`Pedido ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`);
        
        // Recarregar estatísticas após aprovação/rejeição
        loadDashboardStats();
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert(`Erro ao ${action} o pedido. Tente novamente.`);
    } finally {
      setProcessingRequest(null);
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  const breadcrumb = {
    items: [
      { label: "Painel de Controlo", href: "/dashboard" },
      { label: "Visão Geral" },
    ]
  }

  const accessibleCompanies = getAccessibleCompanies();

  // Dados específicos por tipo de utilizador
  const getMetricsCards = () => {
    if (user.type === 'client') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">As Minhas Empresas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{accessibleCompanies.length}</div>
              <p className="text-xs text-muted-foreground">
                Empresas ativas
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Documentos Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">3</div>
              <p className="text-xs text-muted-foreground">
                Para envio
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Próxima Obrigação</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">15 Jan</div>
              <p className="text-xs text-muted-foreground">
                Declaração IVA
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Situação Fiscal</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Em dia</div>
              <p className="text-xs text-muted-foreground">
                Todas as obrigações
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (user.type === 'accountant') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total de Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingStats ? '...' : dashboardStats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.approvedClients} aprovados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Honorários
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingStats ? '...' : `€${dashboardStats.totalRevenue || 0}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Receita total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Obrigações Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingStats ? '...' : dashboardStats.pendingObligations || 0}
              </div>
              <p className="text-xs text-muted-foreground">Para esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Pedidos Pendentes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoadingStats ? '...' : dashboardStats.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground">Para aprovação</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (user.type === 'admin') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingStats ? '...' : dashboardStats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.approvedClients} aprovados
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Pedidos Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoadingStats ? '...' : dashboardStats.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                Para aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Clientes Rejeitados</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isLoadingStats ? '...' : dashboardStats.rejectedClients}
              </div>
              <p className="text-xs text-muted-foreground">
                Total rejeitados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoadingStats ? '...' : `€${dashboardStats.totalRevenue || 0}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Receita acumulada
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  // Conteúdo específico para cada tipo de usuário
  const getClientContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              As Minhas Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessibleCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">NIPC: {company.nipc}</p>
                  </div>
                  <Badge 
                    variant={company.status === 'active' ? 'default' : 
                            company.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {company.status === 'active' ? 'Ativa' :
                     company.status === 'pending' ? 'Pendente' : 'Inativa'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Obrigações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                <div>
                  <p className="font-medium">Declaração Mensal IVA</p>
                  <p className="text-sm text-muted-foreground">Vencimento: 15 Jan 2025</p>
                </div>
                <Badge variant="secondary">Pendente</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">IES 2024</p>
                  <p className="text-sm text-muted-foreground">Vencimento: 31 Jul 2025</p>
                </div>
                <Badge variant="outline">Agendada</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getAccountantContent = () => {
    const obligations = [
      { title: "Declaração Mensal IVA", due: "2025-01-15", status: "pending", company: "Tech Solutions Lda" },
      { title: "IES 2024", due: "2025-07-31", status: "completed", company: "Inovação Digital Unip Lda" },
      { title: "Declaração Trimestral IRC", due: "2025-01-31", status: "urgent", company: "Consultoria Estratégica SA" },
      { title: "Mod. 22 IRC", due: "2025-05-31", status: "pending", company: "Serviços Gerais Lda" },
    ];

    return (
      <div className="space-y-6">
        {/* Seção de Pedidos Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pedidos Pendentes para Aprovação
              {(adminContext?.pendingRequests || []).length > 0 && (
                <Badge variant="destructive">{(adminContext?.pendingRequests || []).length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adminContext?.isLoadingRequests ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Carregando pedidos...</p>
              </div>
            ) : (adminContext?.pendingRequests || []).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum pedido pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(adminContext?.pendingRequests || []).map((request) => {
                  
                  // Acessar propriedades dinamicamente para contornar limitações do TypeScript
                  const requestData = (request as unknown as Record<string, unknown>);
                  const userInfo = requestData.user as Record<string, unknown> | undefined;
                  const requestFormData = requestData.request_data as Record<string, unknown> | undefined;
                  const submittedAt = requestData.submitted_at as string | undefined;
                  
                  // Dados a serem exibidos (dados estão diretamente no request, não em sub-objetos)
                  const displayData = {
                    name: String(requestData.name || userInfo?.name || requestFormData?.name || 'Nome não disponível'),
                    email: String(requestData.email || userInfo?.email || requestFormData?.email || 'Email não disponível'),
                    phone: String(requestData.phone || userInfo?.phone || requestFormData?.phone || 'Telefone não disponível'),
                    nif: String(requestData.nif || userInfo?.nif || requestFormData?.nif || 'NIF não disponível'),
                    username: String(requestData.username || requestFormData?.username || ''),
                    companyName: String(requestData.company_name || requestFormData?.company_name || ''),
                    tradeName: String(requestData.trade_name || requestFormData?.trade_name || ''),
                    nipc: String(requestData.nipc || requestFormData?.nipc || ''),
                    legalForm: String(requestData.legal_form || requestFormData?.legal_form || ''),
                    cae: String(requestData.cae || requestFormData?.cae || ''),
                    shareCapital: String(requestData.share_capital || requestFormData?.share_capital || ''),
                    address: String(requestData.fiscal_address || requestData.address || requestFormData?.address || ''),
                    postalCode: String(requestData.fiscal_postal_code || requestData.postal_code || requestFormData?.postal_code || ''),
                    city: String(requestData.fiscal_city || requestData.city || requestFormData?.city || ''),
                    country: String(requestData.country || requestFormData?.country || '')
                  };
                          
                          return (
                  <div key={request.id} className="border rounded-lg space-y-3">
                    {/* Versão compacta - sempre visível */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{displayData.name}</p>
                            <Badge variant="outline">
                              📅 {submittedAt ? new Date(submittedAt).toLocaleDateString('pt-PT') : 'Data não disponível'}
                            </Badge>
                          </div>
                        </div>
                        {expandedRequest !== request.id && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(request.id, true);
                              }}
                              disabled={processingRequest === request.id}
                            >
                              {processingRequest === request.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                                  Processando...
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Aprovar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveRequest(request.id, false);
                              }}
                              disabled={processingRequest === request.id}
                            >
                              {processingRequest === request.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                  Processando...
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Rejeitar
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalhes expandidos - só aparece quando clicado */}
                    {expandedRequest === request.id && (
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <div className="pt-4 space-y-4">
                          <h4 className="font-semibold text-lg mb-3">Detalhes do Registro</h4>
                          
                          {/* Informações Pessoais */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm text-gray-600 uppercase tracking-wide">Informações Pessoais</h5>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Nome:</span> {displayData.name}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Email:</span> {displayData.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Telefone:</span> {displayData.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">NIF:</span> {displayData.nif}
                                </div>
                                {displayData.username && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Username:</span> {displayData.username}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Informações da Empresa */}
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm text-gray-600 uppercase tracking-wide">Informações da Empresa</h5>
                              <div className="space-y-1">
                                {displayData.companyName && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Nome da Empresa:</span> {displayData.companyName}
                                  </div>
                                )}
                                {displayData.tradeName && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Nome Comercial:</span> {displayData.tradeName}
                                  </div>
                                )}
                                {displayData.nipc && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">NIPC:</span> {displayData.nipc}
                                  </div>
                                )}
                                {displayData.legalForm && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Forma Legal:</span> {displayData.legalForm}
                                  </div>
                                )}
                                {displayData.cae && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">CAE:</span> {displayData.cae}
                                  </div>
                                )}
                                {displayData.shareCapital && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Capital Social:</span> {displayData.shareCapital}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Morada */}
                          {(displayData.address || displayData.postalCode || displayData.city) && (
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm text-gray-600 uppercase tracking-wide">Morada</h5>
                              <div className="text-sm">
                                {displayData.address && <div>{displayData.address}</div>}
                                <div className="flex gap-2">
                                  {displayData.postalCode && <span>{displayData.postalCode}</span>}
                                  {displayData.city && <span>{displayData.city}</span>}
                                  {displayData.country && <span>{displayData.country}</span>}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Data de submissão */}
                          <div className="pt-2 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Submetido em:</span> 
                              {submittedAt ? new Date(submittedAt).toLocaleDateString('pt-PT', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Data não disponível'}
                            </div>
                          </div>

                          {/* Botões de ação na versão expandida */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                              onClick={() => handleApproveRequest(request.id, true)}
                              disabled={processingRequest === request.id}
                            >
                              {processingRequest === request.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                  Processando...
                                </>
                              ) : (
                                <>
                                  <Check className="h-5 w-5 mr-2" />
                                  Aprovar Pedido
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                              onClick={() => handleApproveRequest(request.id, false)}
                              disabled={processingRequest === request.id}
                            >
                              {processingRequest === request.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  Processando...
                                </>
                              ) : (
                                <>
                                  <X className="h-5 w-5 mr-2" />
                                  Rejeitar Pedido
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clientes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingClients ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accounting-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Carregando clientes...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/avatars/empresa-${index + 1}.jpg`} />
                      <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{client.name}</p>
                      <div className="text-sm text-muted-foreground">
                        {client.username && client.username !== client.email && (
                          <div>Username: {client.username}</div>
                        )}
                        <div>{client.email}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={client.status === "Aprovado" ? "default" : 
                              client.status === "Pendente" ? "secondary" : "destructive"}
                    >
                      {client.status}
                    </Badge>
                  </div>
                ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Obrigações Fiscais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {obligations.map((obligation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{obligation.title}</p>
                      <p className="text-sm text-muted-foreground">{obligation.company}</p>
                      <p className="text-xs text-muted-foreground">Vencimento: {obligation.due}</p>
                    </div>
                    <Badge 
                      variant={obligation.status === "completed" ? "default" : 
                              obligation.status === "urgent" ? "destructive" : "secondary"}
                    >
                      {obligation.status === "completed" ? "Concluído" :
                       obligation.status === "urgent" ? "Urgente" : "Pendente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const getAdminContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Logs do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Login realizado</p>
                  <p className="text-sm text-muted-foreground">maria.santos@techsolutions.pt</p>
                  <p className="text-xs text-muted-foreground">há 5 minutos</p>
                </div>
                <Badge variant="default">Sucesso</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Backup automático</p>
                  <p className="text-sm text-muted-foreground">Sistema completo</p>
                  <p className="text-xs text-muted-foreground">há 2 horas</p>
                </div>
                <Badge variant="default">Concluído</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                <div>
                  <p className="font-medium">Alerta de segurança</p>
                  <p className="text-sm text-muted-foreground">Tentativa de login falhada</p>
                  <p className="text-xs text-muted-foreground">há 1 dia</p>
                </div>
                <Badge variant="secondary">Atenção</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Monitorização do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memória</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Armazenamento</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout breadcrumb={breadcrumb}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {user.type === 'client' && 'Portal do Cliente'}
              {user.type === 'accountant' && 'Painel de Controlo Contabilístico'}
              {user.type === 'admin' && 'Administração do Sistema'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.type === 'client' && 'Acompanhe a situação das suas empresas e obrigações fiscais'}
              {user.type === 'accountant' && 'Visão geral das operações contabilísticas e fiscais'}
              {user.type === 'admin' && 'Monitorização e gestão do sistema'}
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {user.type === 'client' && (
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Enviar Documentos
              </Button>
            )}
            {(user.type === 'accountant' || user.type === 'admin') && (
              <>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Documentos
                </Button>
                <Button className="bg-accounting-primary hover:bg-accounting-primary/90" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </>
            )}
          </div>
        </div>

        {/* KPI Cards baseadas no tipo de utilizador */}
        {getMetricsCards()}

        {/* Conteúdo específico por tipo de utilizador */}
        {user.type === 'client' && getClientContent()}
        {user.type === 'accountant' && getAccountantContent()}
        {user.type === 'admin' && getAdminContent()}
      </div>
    </DashboardLayout>
  )
}
