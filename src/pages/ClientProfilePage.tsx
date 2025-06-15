import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building,
  Upload,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle
} from "lucide-react"

export default function ClientProfilePage() {
  const breadcrumb = {
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Meu Perfil" },
    ]
  }

  // Dados mock do cliente
  const clientData = {
    name: "Tech Solutions Lda",
    nipc: "501234567",
    nif: "PT501234567",
    address: "Rua da Tecnologia, 123 - 1200-200 Lisboa",
    phone: "+351 21 123 4567",
    email: "contacto@techsolutions.pt",
    contact: "Carlos Silva",
    regime: "Normal",
    status: "Activa"
  }

  const companies = [
    {
      name: "Tech Solutions Lda",
      nipc: "501234567",
      status: "Activa",
      type: "Sede"
    },
    {
      name: "Tech Innovation Sucursal",
      nipc: "501234568",
      status: "Activa", 
      type: "Sucursal"
    }
  ]

  const documents = [
    { name: "Facturas - Dezembro 2024", date: "2024-12-28", status: "Processado", type: "fiscal" },
    { name: "Extracto Bancário - Dezembro", date: "2024-12-27", status: "Processado", type: "financeiro" },
    { name: "Processamento de Salários - Dezembro", date: "2024-12-26", status: "Processado", type: "pessoal" },
    { name: "Recibos de Despesas", date: "2024-12-25", status: "Pendente", type: "fiscal" },
  ]

  const obligations = [
    { title: "DAS - Janeiro/2025", due: "2025-01-20", status: "pending" },
    { title: "DCTF - Dezembro/2024", due: "2025-01-15", status: "completed" },
    { title: "SPED ECF 2024", due: "2025-01-31", status: "pending" },
  ]

  return (
    <DashboardLayout breadcrumb={breadcrumb}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">O Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Gira as suas informações e acompanhe os seus documentos
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Enviar Documento
            </Button>
            <Button className="bg-accounting-primary hover:bg-accounting-primary/90" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Solicitar Relatório
            </Button>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-accounting-primary" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Denominação Social</label>
                  <div className="text-base font-medium">{clientData.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NIPC</label>
                  <div className="text-base font-medium">{clientData.nipc}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NIF</label>
                  <div className="text-base font-medium">{clientData.nif}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Regime de IVA</label>
                  <div className="text-base font-medium">{clientData.regime}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Morada</label>
                  <div className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {clientData.address}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accounting-secondary" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.contact}</span>
              </div>
              <div className="pt-2">
                <Badge className="bg-accounting-success/10 text-accounting-success hover:bg-accounting-success/20">
                  {clientData.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Empresas</CardTitle>
            <CardDescription>Empresas vinculadas ao seu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {companies.map((company, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-accounting-surface/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{company.name}</h4>
                    <Badge variant="outline">{company.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">NIPC: {company.nipc}</p>
                  <Badge className="bg-accounting-success/10 text-accounting-success hover:bg-accounting-success/20">
                    {company.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents and Obligations */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documentos Recentes</CardTitle>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge 
                      className={
                        doc.status === "Processado" 
                          ? "bg-accounting-success/10 text-accounting-success hover:bg-accounting-success/20"
                          : "bg-accounting-warning/10 text-accounting-warning hover:bg-accounting-warning/20"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Obligations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Próximas Obrigações</CardTitle>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {obligations.map((obligation, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg border-l-4 ${
                      obligation.status === 'completed' 
                        ? 'border-l-accounting-success bg-accounting-success/5' 
                        : 'border-l-accounting-warning bg-accounting-warning/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{obligation.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Vence: {new Date(obligation.due).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {obligation.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-accounting-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-accounting-warning" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
