import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, Download, FileText, User, Building, Phone, Mail, MapPin } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRequest, fetchRequestDetails, approveRequest } = useAdmin();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                  <p className="font-medium">{currentRequest.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NIF</Label>
                  <p className="font-medium">{currentRequest.nif}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {currentRequest.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                  <p className="font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {currentRequest.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Type Specific Information */}
          {currentRequest.type === 'existing-client' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Detalhes Cliente Existente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo de Acesso Solicitado</Label>
                  <p className="font-medium">
                    {currentRequest.data.accessType === 'contabilidade' && 'Contabilidade'}
                    {currentRequest.data.accessType === 'salarios' && 'Processamento de Salários'}
                    {currentRequest.data.accessType === 'ambos' && 'Contabilidade e Processamento de Salários'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Detalhes Novo Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo de Negócio</Label>
                    <p className="font-medium">{currentRequest.data.businessType || 'Não especificado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Regime Contabilístico</Label>
                    <p className="font-medium">{currentRequest.data.accountingRegime || 'Não especificado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Faturação Anual Estimada</Label>
                    <p className="font-medium">
                      {currentRequest.data.estimatedRevenue ? `€${currentRequest.data.estimatedRevenue}` : 'Não especificado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Documentos/Mês</Label>
                    <p className="font-medium">{currentRequest.data.monthlyDocuments || 'Não especificado'}</p>
                  </div>
                </div>

                {currentRequest.data.address && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Morada Fiscal</Label>
                    <p className="font-medium flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      {currentRequest.data.address}, {currentRequest.data.postalCode} {currentRequest.data.city}
                    </p>
                  </div>
                )}

                {currentRequest.data.observations && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <p className="font-medium">{currentRequest.data.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {currentRequest.data.documents && Array.isArray(currentRequest.data.documents) && currentRequest.data.documents.length > 0 && (
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
