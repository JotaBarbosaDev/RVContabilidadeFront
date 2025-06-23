import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Download, 
  FileText, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  Shield,
  Clock
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRequest, fetchRequestDetails, approveRequest } = useAdmin();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  // Labels para diferentes valores
  const vatRegimeLabels = {
    "normal": "Normal",
    "isento_art53": "Isento (Art. 53º)",
    "pequeno_retalhista": "Pequeno Retalhista"
  };

  const accountingRegimeLabels = {
    "organizada": "Contabilidade Organizada",
    "simplificada": "Contabilidade Simplificada"
  };

  const reportFrequencyLabels = {
    "mensal": "Mensal",
    "trimestral": "Trimestral"
  };

  const booleanLabels: Record<string, string> = {
    "true": "Sim",
    "false": "Não",
    "sim": "Sim",
    "não": "Não",
    "nao": "Não"
  };

  // Helper function para formatar moeda
  const formatCurrency = (value: unknown): string => {
    if (!value || value === 0 || value === "0") return "€0";
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(numValue)) return "€0";
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(numValue);
  };

  // Helper function para valores numéricos
  const getNumericValue = (value: unknown, defaultText = "0"): string => {
    if (value === null || value === undefined || value === 0 || value === "0" || value === "") {
      return defaultText;
    }
    return String(value);
  };

  // Helper function principal para acessar dados do request
  const getRequestData = (key: string): string => {
    if (!currentRequest?.data || typeof currentRequest.data !== 'object') {
      return 'Não informado';
    }
    
    const data = currentRequest.data as Record<string, unknown>;
    
    // Verificar se dados estão num sub-objeto company primeiro
    if (data.company && typeof data.company === 'object') {
      const companyData = data.company as Record<string, unknown>;
      const possibleKeys = [
        key,
        key.replace(/([A-Z])/g, '_$1').toLowerCase(),
        key.replace(/_/g, ''),
        key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
      ];
      
      for (const possibleKey of possibleKeys) {
        if (companyData[possibleKey] !== undefined && companyData[possibleKey] !== null && companyData[possibleKey] !== "") {
          const value = companyData[possibleKey];
          return formatFieldValue(key, value);
        }
      }
    }
    
    // Tentar diferentes variações do nome do campo no objeto principal
    const possibleKeys = [
      key,
      key.replace(/([A-Z])/g, '_$1').toLowerCase(),
      key.replace(/_/g, ''),
      key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
    ];
    
    for (const possibleKey of possibleKeys) {
      if (data[possibleKey] !== undefined && data[possibleKey] !== null && data[possibleKey] !== "") {
        const value = data[possibleKey];
        return formatFieldValue(key, value);
      }
    }
    
    return 'Não informado';
  };

  // Helper para formatar valores baseado no tipo de campo
  const formatFieldValue = (key: string, value: unknown): string => {
    // Aplicar labels específicos baseado no campo
    if (key === 'vatRegime' || key === 'vat_regime') {
      return vatRegimeLabels[value as keyof typeof vatRegimeLabels] || String(value || 'Não informado');
    }
    if (key === 'accountingRegime' || key === 'accounting_regime') {
      return accountingRegimeLabels[value as keyof typeof accountingRegimeLabels] || String(value || 'Não informado');
    }
    if (key === 'reportFrequency' || key === 'report_frequency') {
      return reportFrequencyLabels[value as keyof typeof reportFrequencyLabels] || String(value || 'Não informado');
    }
    if (key.includes('Revenue') || key.includes('revenue') || key.includes('Capital') || key.includes('capital')) {
      return formatCurrency(value);
    }
    if (key.includes('Employee') || key.includes('employee') || key.includes('Invoice') || key.includes('invoice')) {
      return getNumericValue(value);
    }
    if (key.includes('has') || key.includes('is') || typeof value === 'boolean') {
      return booleanLabels[String(value)] || String(value || 'Não informado');
    }
    
    return String(value || 'Não informado');
  };

  const formatRequestDate = (dateValue: unknown): string => {
    if (!dateValue || typeof dateValue !== 'string' || dateValue === 'null') {
      return 'Não informado';
    }
    try {
      return new Date(dateValue).toLocaleDateString('pt-PT');
    } catch {
      return 'Não informado';
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequestDetails(id);
    }
  }, [id, fetchRequestDetails]);

  const handleProcessRequest = async (approved: boolean) => {
    if (!id) return;
    
    setIsProcessing(true);
    try {
      await approveRequest(id, approved, notes);
      navigate('/admin/requests');
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setIsProcessing(false);
      setShowApprovalForm(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accounting-primary mx-auto mb-4"></div>
          <p>A carregar detalhes da solicitação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalhes da Solicitação</h1>
            <p className="text-muted-foreground">
              Solicitação #{currentRequest.id}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(currentRequest.status)}
          {currentRequest.status === 'pending' && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => {
                  setApprovalType('approve');
                  setShowApprovalForm(true);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => {
                  setApprovalType('reject');
                  setShowApprovalForm(true);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 👤 Dados Pessoais */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-lg text-blue-800">
                <User className="h-5 w-5" />
                <span>👤 Dados Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome</Label>
                  <p className="mt-1 text-gray-900 font-medium">{currentRequest.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="mt-1 text-gray-900 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {currentRequest.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  <p className="mt-1 text-gray-900 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {currentRequest.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">NIF</Label>
                  <p className="mt-1 text-gray-900 font-medium">{currentRequest.nif}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data de Nascimento</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {formatRequestDate(getRequestData('date_of_birth'))}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estado Civil</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('marital_status')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🏠 Morada Fiscal */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-lg text-green-800">
                <MapPin className="h-5 w-5" />
                <span>🏠 Morada Fiscal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Endereço</Label>
                <p className="mt-1 text-gray-900 font-medium">
                  {getRequestData('fiscal_address') !== 'Não informado' ? 
                   getRequestData('fiscal_address') : 
                   getRequestData('address')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Código Postal</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('fiscal_postal_code') !== 'Não informado' ? 
                     getRequestData('fiscal_postal_code') : 
                     getRequestData('postalCode')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Cidade</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('fiscal_city') !== 'Não informado' ? 
                     getRequestData('fiscal_city') : 
                     getRequestData('city')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Tipo de Cliente</Label>
                <p className="mt-1 text-gray-900 font-medium">
                  {currentRequest.type === 'new-client' ? 'Empresarial' : 'Particular'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 🏢 Dados da Empresa */}
          {currentRequest.type === 'new-client' && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-purple-800">
                  <Building className="h-5 w-5" />
                  <span>🏢 Dados da Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome da Empresa</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('company_name') !== 'Não informado' ? 
                     getRequestData('company_name') : 
                     currentRequest.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">NIPC</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('nipc') !== 'Não informado' ? 
                       getRequestData('nipc') : 
                       currentRequest.nif}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">CAE</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('cae')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Forma Jurídica</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('legal_form')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Constituição</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {formatRequestDate(getRequestData('founding_date'))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 📊 Atividade Empresarial */}
          {currentRequest.type === 'new-client' && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-orange-800">
                  <FileText className="h-5 w-5" />
                  <span>📊 Atividade Empresarial</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Descrição da Atividade</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('business_activity')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Faturação Estimada</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('estimated_revenue')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Faturas/Mês</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('monthly_invoices')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Funcionários</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('number_employees')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ⚙️ Regimes Fiscais */}
          {currentRequest.type === 'new-client' && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-teal-800">
                  <CreditCard className="h-5 w-5" />
                  <span>⚙️ Regimes Fiscais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Contabilidade</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('accounting_regime')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">IVA</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('vat_regime')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Relatórios</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('report_frequency')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 🔐 Credenciais (para clientes existentes) */}
          {currentRequest.type === 'existing-client' && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-gray-800">
                  <Shield className="h-5 w-5" />
                  <span>🔐 Acesso Solicitado</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tipo de Acesso</Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {getRequestData('access_type') === 'contabilidade' && 'Contabilidade'}
                    {getRequestData('access_type') === 'salarios' && 'Processamento de Salários'}
                    {getRequestData('access_type') === 'ambos' && 'Contabilidade e Processamento de Salários'}
                    {!getRequestData('access_type') && 'Não especificado'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 📝 Situação Atual e Observações */}
          {(getRequestData('observations') !== 'Não informado' || 
            getRequestData('has_activity') !== 'Não informado' || 
            getRequestData('has_social_security') !== 'Não informado' || 
            getRequestData('has_debts') !== 'Não informado') && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-yellow-800">
                  <FileText className="h-5 w-5" />
                  <span>📝 Situação Atual e Observações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {getRequestData('has_activity') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tem Atividade</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('has_activity')}
                    </p>
                  </div>
                )}
                {getRequestData('has_social_security') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Segurança Social</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('has_social_security')}
                    </p>
                  </div>
                )}
                {getRequestData('has_debts') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tem Dívidas</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('has_debts')}
                    </p>
                  </div>
                )}
                {getRequestData('observations') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Observações</Label>
                    <p className="mt-1 text-gray-900 font-medium whitespace-pre-wrap">
                      {getRequestData('observations')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 💼 Informações Operacionais */}
          {(getRequestData('document_delivery') !== 'Não informado' || 
            getRequestData('invoicing_tool') !== 'Não informado') && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-lg text-indigo-800">
                  <Building className="h-5 w-5" />
                  <span>💼 Informações Operacionais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {getRequestData('document_delivery') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Entrega de Documentos</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('document_delivery')}
                    </p>
                  </div>
                )}
                {getRequestData('invoicing_tool') !== 'Não informado' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Ferramenta de Faturação</Label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {getRequestData('invoicing_tool')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {currentRequest.data?.documents && Array.isArray(currentRequest.data.documents) && currentRequest.data.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documentos Anexados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentRequest.data.documents.map((doc: { name?: string; url?: string; type?: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{doc.name || `Documento ${index + 1}`}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Solicitação Criada</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(currentRequest.createdAt)}
                    </p>
                  </div>
                </div>
                {currentRequest.status !== 'pending' && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      currentRequest.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">
                        {currentRequest.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(currentRequest.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Solicitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                <p className="font-medium">
                  {currentRequest.type === 'existing-client' ? 'Cliente Existente' : 'Novo Cliente'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(currentRequest.status)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">ID da Solicitação</Label>
                <p className="font-mono text-sm">{currentRequest.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                <p className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDate(currentRequest.createdAt)}
                </p>
              </div>
              {currentRequest.updatedAt && currentRequest.updatedAt !== currentRequest.createdAt && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Última Atualização</Label>
                  <p className="font-medium">{formatDate(currentRequest.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Form Modal */}
      {showApprovalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>
                {approvalType === 'approve' ? 'Aprovar Solicitação' : 'Rejeitar Solicitação'}
              </CardTitle>
              <CardDescription>
                {approvalType === 'approve' 
                  ? 'Confirme a aprovação desta solicitação. Serão criadas as credenciais de acesso.'
                  : 'Confirme a rejeição desta solicitação. Indique o motivo abaixo.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">
                  {approvalType === 'approve' ? 'Notas (opcional)' : 'Motivo da rejeição'}
                </Label>
                <textarea
                  id="notes"
                  placeholder={approvalType === 'approve' 
                    ? 'Adicione notas sobre a aprovação...'
                    : 'Explique o motivo da rejeição...'
                  }
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleProcessRequest(approvalType === 'approve')}
                  disabled={isProcessing || (approvalType === 'reject' && !notes.trim())}
                  className={`flex-1 ${
                    approvalType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isProcessing ? 'A processar...' : (
                    approvalType === 'approve' ? 'Aprovar' : 'Rejeitar'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
