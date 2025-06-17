import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { useEffect, useState } from "react"

// Componente Badge simples já que não temos o shadcn badge
const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800", 
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default function DashboardPage() {
  const { user, getAccessibleCompanies } = useAuth();
  const { pendingRequests, fetchPendingRequests, approveRequest, isLoadingRequests } = useAdmin();
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  useEffect(() => {
    console.log('DashboardPage useEffect - user:', user);
    console.log('DashboardPage useEffect - user type:', user?.type);
    if (user?.type === 'accountant') {
      console.log('Fetching pending requests for accountant...');
      fetchPendingRequests();
    }
  }, [user, fetchPendingRequests]);

  // Test API connection
  useEffect(() => {
    const testAPI = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Testing API connection with token:', token ? 'exists' : 'missing');
        
        const response = await fetch('http://localhost:8080/api/admin/pending-requests', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('API Test - Response status:', response.status);
        console.log('API Test - Response headers:', response.headers);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Test - Success data:', data);
        } else {
          const errorText = await response.text();
          console.log('API Test - Error response:', errorText);
        }
      } catch (error) {
        console.error('API Test - Network error:', error);
      }
    };
    
    if (user?.type === 'accountant') {
      testAPI();
    }
  }, [user]);

  // Debug logs
  console.log('DashboardPage render - pendingRequests:', pendingRequests);
  console.log('DashboardPage render - isLoadingRequests:', isLoadingRequests);

  const handleApproveRequest = async (requestId: string, approved: boolean) => {
    setProcessingRequest(requestId);
    try {
      await approveRequest(requestId, approved);
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
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
              <div className="text-2xl font-bold text-card-foreground">24</div>
              <p className="text-xs text-muted-foreground">+2 este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Receita Mensal3
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                €1.210
              </div>
              <p className="text-xs text-muted-foreground">
                +12% mês anterior
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
              <div className="text-2xl font-bold text-card-foreground">7</div>
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
                {pendingRequests.length}
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
              <CardTitle className="text-sm font-medium text-card-foreground">Utilizadores Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">47</div>
              <p className="text-xs text-muted-foreground">
                +3 esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Performance Sistema</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-xs text-muted-foreground">
                Uptime últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Alertas de Segurança</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-xs text-muted-foreground">
                Requerem atenção
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  // Componente para exibir conteúdo específico do cliente
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

  // Componente para exibir conteúdo específico do contabilista
  const getAccountantContent = () => {
    const recentClients = [
      { name: "Tech Solutions Lda", email: "contacto@techsolutions.pt", status: "Em dia", nipc: "501234567" },
      { name: "Inovação Digital Unip Lda", email: "fiscal@inovacao.pt", status: "Pendente", nipc: "501234568" },
      { name: "Consultoria Estratégica SA", email: "admin@consultoria.pt", status: "Em dia", nipc: "501234569" },
      { name: "Serviços Gerais Lda", email: "juridico@servicos.pt", status: "Urgente", nipc: "501234570" },
    ];

    const obligations = [
      { title: "Declaração Mensal IVA", due: "2025-01-20", status: "pending", company: "Tech Solutions Lda" },
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
              {pendingRequests.length > 0 && (
                <Badge variant="destructive">{pendingRequests.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Carregando pedidos...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum pedido pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{request.name}</p>
                          <Badge variant={request.type === 'new-client' ? 'default' : 'secondary'}>
                            {request.type === 'new-client' ? 'Novo Cliente' : 'Cliente Existente'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          NIF: {request.nif}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Criado em: {new Date(request.createdAt).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApproveRequest(request.id, true)}
                          disabled={processingRequest === request.id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleApproveRequest(request.id, false)}
                          disabled={processingRequest === request.id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-3">
                {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/avatars/empresa-${index + 1}.jpg`} />
                      <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <Badge 
                      variant={client.status === "Em dia" ? "default" : 
                              client.status === "Pendente" ? "secondary" : "destructive"}
                    >
                      {client.status}
                    </Badge>
                  </div>
                ))}
              </div>
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

  // Componente para exibir conteúdo específico do admin
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
