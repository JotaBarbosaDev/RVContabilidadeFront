import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Edit,
  Save,
  X,
  UserCircle,
  Building2,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

interface UserProfile {
  // 🎯 DADOS DO REGISTO (apenas leitura)
  full_name: string;
  username: string;
  email: string;
  phone: string;
  nif: string;
  date_of_birth?: string;
  fiscal_address?: string;
  fiscal_postal_code?: string;
  fiscal_city?: string;
  company_name?: string;
  nipc?: string;
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
  
  // 📋 DADOS ADICIONAIS PARA PERFIL (editáveis)
  // Dados pessoais adicionais
  marital_status?: string;
  citizen_card_number?: string;
  citizen_card_expiry?: string;
  fixed_phone?: string;
  fiscal_county?: string;
  fiscal_district?: string;
  portal_financas_user?: string;
  portal_financas_password?: string;
  e_fatura_user?: string;
  e_fatura_password?: string;
  ss_direct_user?: string;
  ss_direct_password?: string;
  official_email?: string;
  billing_software?: string;
  preferred_format?: string;
  preferred_contact_hours?: string;
  
  // Dados empresa adicionais
  trade_name?: string;
  corporate_object?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  county?: string;
  district?: string;
  share_capital?: number;
  group_start_date?: string;
  bank_name?: string;
  iban?: string;
  bic?: string;
  annual_revenue?: number;
  has_stock?: boolean;
  main_clients?: string;
  main_suppliers?: string;
}

export default function ClientProfilePage() {
  const { isTokenValid } = useAuth();
  const [activeTab, setActiveTab] = useState<'registered' | 'additional-personal' | 'additional-company'>('registered');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const breadcrumb = {
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Meu Perfil" },
    ]
  };

  // Carregar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !isTokenValid()) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/client/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.user || data);
          setEditedProfile(data.user || data);
        } else {
          console.error('Erro ao carregar perfil:', response.status);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isTokenValid]);

  const handleSave = async () => {
    if (!editedProfile) return;
    
    const token = localStorage.getItem('authToken');
    if (!token || !isTokenValid()) return;

    setIsLoading(true);
    try {
      // Separar apenas dados ADICIONAIS (não os do registo)
      const personalData = {
        marital_status: editedProfile.marital_status,
        citizen_card_number: editedProfile.citizen_card_number,
        citizen_card_expiry: editedProfile.citizen_card_expiry,
        fixed_phone: editedProfile.fixed_phone,
        fiscal_county: editedProfile.fiscal_county,
        fiscal_district: editedProfile.fiscal_district,
        portal_financas_user: editedProfile.portal_financas_user,
        portal_financas_password: editedProfile.portal_financas_password,
        e_fatura_user: editedProfile.e_fatura_user,
        e_fatura_password: editedProfile.e_fatura_password,
        ss_direct_user: editedProfile.ss_direct_user,
        ss_direct_password: editedProfile.ss_direct_password,
        official_email: editedProfile.official_email,
        billing_software: editedProfile.billing_software,
        preferred_format: editedProfile.preferred_format,
        preferred_contact_hours: editedProfile.preferred_contact_hours,
      };

      const companyData = {
        trade_name: editedProfile.trade_name,
        corporate_object: editedProfile.corporate_object,
        address: editedProfile.address,
        postal_code: editedProfile.postal_code,
        city: editedProfile.city,
        county: editedProfile.county,
        district: editedProfile.district,
        share_capital: editedProfile.share_capital,
        group_start_date: editedProfile.group_start_date,
        bank_name: editedProfile.bank_name,
        iban: editedProfile.iban,
        bic: editedProfile.bic,
        annual_revenue: editedProfile.annual_revenue,
        has_stock: editedProfile.has_stock,
        main_clients: editedProfile.main_clients,
        main_suppliers: editedProfile.main_suppliers,
      };

      // Enviar dados pessoais
      const personalResponse = await fetch('http://localhost:3000/api/client/complete-user-data', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalData),
      });

      if (!personalResponse.ok) {
        throw new Error('Erro ao atualizar dados pessoais');
      }

      // Enviar dados da empresa
      const companyResponse = await fetch('http://localhost:3000/api/client/complete-company-data', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!companyResponse.ok) {
        throw new Error('Erro ao atualizar dados da empresa');
      }

      // Atualizar estado local
      setProfile(editedProfile);
      setIsEditing(false);
      
      alert('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number | boolean) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Contar dados em falta
  const getIncompleteFieldsCount = (): { personal: number; company: number } => {
    if (!profile) return { personal: 0, company: 0 };

    const personalFields = [
      'marital_status', 'citizen_card_number', 'fixed_phone', 'fiscal_county', 
      'fiscal_district', 'portal_financas_user', 'e_fatura_user', 'ss_direct_user',
      'official_email', 'billing_software', 'preferred_format', 'preferred_contact_hours'
    ];

    const companyFields = [
      'trade_name', 'corporate_object', 'address', 'postal_code', 'city',
      'county', 'district', 'bank_name', 'iban', 'main_clients', 'main_suppliers'
    ];

    const personalIncomplete = personalFields.filter(field => 
      !profile[field as keyof UserProfile] || profile[field as keyof UserProfile] === ''
    ).length;

    const companyIncomplete = companyFields.filter(field => 
      !profile[field as keyof UserProfile] || profile[field as keyof UserProfile] === ''
    ).length;

    return { personal: personalIncomplete, company: companyIncomplete };
  };

  const incompleteCounts = getIncompleteFieldsCount();

  if (isLoading && !profile) {
    return (
      <DashboardLayout breadcrumb={breadcrumb}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accounting-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando perfil...</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">O Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os seus dados adicionais e complete o seu perfil
            </p>
            {(incompleteCounts.personal > 0 || incompleteCounts.company > 0) && (
              <div className="mt-2 flex gap-2">
                {incompleteCounts.personal > 0 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {incompleteCounts.personal} dados pessoais em falta
                  </Badge>
                )}
                {incompleteCounts.company > 0 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {incompleteCounts.company} dados empresariais em falta
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {activeTab !== 'registered' && !isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-accounting-primary hover:bg-accounting-primary/90"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            ) : activeTab !== 'registered' && isEditing ? (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-accounting-success hover:bg-accounting-success/90"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'registered'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2 inline" />
            Dados do Registo
          </button>
          <button
            onClick={() => setActiveTab('additional-personal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'additional-personal'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCircle className="h-4 w-4 mr-2 inline" />
            Dados Pessoais Adicionais
            {incompleteCounts.personal > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {incompleteCounts.personal}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('additional-company')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'additional-company'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4 mr-2 inline" />
            Dados Empresariais Adicionais
            {incompleteCounts.company > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {incompleteCounts.company}
              </span>
            )}
          </button>
        </div>

        {/* Registered Data Tab (Read Only) */}
        {activeTab === 'registered' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accounting-success" />
                  Dados do Registo (Já Preenchidos)
                </CardTitle>
                <CardDescription>
                  Estes dados foram fornecidos durante o registo e não podem ser alterados aqui
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dados Pessoais do Registo */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-accounting-primary">👤 Informações Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div>
                      <Label className="text-muted-foreground">Nome Completo</Label>
                      <p className="font-medium">{profile?.full_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Username</Label>
                      <p className="font-medium">{profile?.username || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{profile?.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Telefone</Label>
                      <p className="font-medium">{profile?.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">NIF</Label>
                      <p className="font-medium">{profile?.nif || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Data de Nascimento</Label>
                      <p className="font-medium">
                        {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('pt-PT') : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Morada Fiscal do Registo */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-accounting-primary">🏠 Morada Fiscal</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Endereço</Label>
                        <p className="font-medium">{profile?.fiscal_address || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Código Postal</Label>
                        <p className="font-medium">{profile?.fiscal_postal_code || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Cidade</Label>
                        <p className="font-medium">{profile?.fiscal_city || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dados da Empresa do Registo */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-accounting-primary">🏢 Dados da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div>
                      <Label className="text-muted-foreground">Nome da Empresa</Label>
                      <p className="font-medium">{profile?.company_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">NIPC</Label>
                      <p className="font-medium">{profile?.nipc || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">CAE</Label>
                      <p className="font-medium">{profile?.cae || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Forma Jurídica</Label>
                      <p className="font-medium">{profile?.legal_form || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Data de Constituição</Label>
                      <p className="font-medium">
                        {profile?.founding_date ? new Date(profile.founding_date).toLocaleDateString('pt-PT') : 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Faturação Estimada</Label>
                      <p className="font-medium">€{profile?.estimated_revenue || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Regimes Fiscais do Registo */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-accounting-primary">⚙️ Regimes e Operações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div>
                      <Label className="text-muted-foreground">Regime de Contabilidade</Label>
                      <p className="font-medium">{profile?.accounting_regime || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Regime de IVA</Label>
                      <p className="font-medium">{profile?.vat_regime || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Frequência de Relatórios</Label>
                      <p className="font-medium">{profile?.report_frequency || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Faturas/Mês</Label>
                      <p className="font-medium">{profile?.monthly_invoices || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Número de Funcionários</Label>
                      <p className="font-medium">{profile?.number_employees || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Nota:</strong> Para alterar estes dados, entre em contacto com o seu contabilista ou o suporte técnico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Personal Data Tab */}
        {activeTab === 'additional-personal' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-accounting-primary" />
                  Dados Pessoais Adicionais
                </CardTitle>
                <CardDescription>
                  Complete os seus dados pessoais adicionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estado Civil e Documentos */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Identificação e Estado Civil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marital_status">Estado Civil</Label>
                      {isEditing ? (
                        <select
                          id="marital_status"
                          value={editedProfile?.marital_status || ''}
                          onChange={(e) => handleInputChange('marital_status', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Selecione</option>
                          <option value="Solteiro">Solteiro(a)</option>
                          <option value="Casado">Casado(a)</option>
                          <option value="Divorciado">Divorciado(a)</option>
                          <option value="Viúvo">Viúvo(a)</option>
                          <option value="União de Facto">União de Facto</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.marital_status || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="citizen_card_number">Número do Cartão de Cidadão</Label>
                      {isEditing ? (
                        <Input
                          id="citizen_card_number"
                          value={editedProfile?.citizen_card_number || ''}
                          onChange={(e) => handleInputChange('citizen_card_number', e.target.value)}
                          placeholder="12345678 9 ZZ0"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.citizen_card_number || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="citizen_card_expiry">Validade do Cartão de Cidadão</Label>
                      {isEditing ? (
                        <Input
                          id="citizen_card_expiry"
                          type="date"
                          value={editedProfile?.citizen_card_expiry || ''}
                          onChange={(e) => handleInputChange('citizen_card_expiry', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">
                          {profile?.citizen_card_expiry ? new Date(profile.citizen_card_expiry).toLocaleDateString('pt-PT') : 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fixed_phone">Telefone Fixo</Label>
                      {isEditing ? (
                        <Input
                          id="fixed_phone"
                          value={editedProfile?.fixed_phone || ''}
                          onChange={(e) => handleInputChange('fixed_phone', e.target.value)}
                          placeholder="+351 21 123 4567"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.fixed_phone || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detalhes da Morada Fiscal */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Detalhes da Morada Fiscal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fiscal_county">Concelho</Label>
                      {isEditing ? (
                        <Input
                          id="fiscal_county"
                          value={editedProfile?.fiscal_county || ''}
                          onChange={(e) => handleInputChange('fiscal_county', e.target.value)}
                          placeholder="Lisboa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.fiscal_county || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fiscal_district">Distrito</Label>
                      {isEditing ? (
                        <Input
                          id="fiscal_district"
                          value={editedProfile?.fiscal_district || ''}
                          onChange={(e) => handleInputChange('fiscal_district', e.target.value)}
                          placeholder="Lisboa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.fiscal_district || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Acessos Digitais */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Acessos Digitais</h3>
                  <div className="space-y-4">
                    {/* Portal das Finanças */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="portal_financas_user">Utilizador Portal das Finanças</Label>
                        {isEditing ? (
                          <Input
                            id="portal_financas_user"
                            value={editedProfile?.portal_financas_user || ''}
                            onChange={(e) => handleInputChange('portal_financas_user', e.target.value)}
                            placeholder="utilizador@financas.gov.pt"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.portal_financas_user || 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="portal_financas_password">Password Portal das Finanças</Label>
                        {isEditing ? (
                          <div className="relative">
                            <Input
                              id="portal_financas_password"
                              type={showPasswords.portal_financas ? 'text' : 'password'}
                              value={editedProfile?.portal_financas_password || ''}
                              onChange={(e) => handleInputChange('portal_financas_password', e.target.value)}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('portal_financas')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                              {showPasswords.portal_financas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.portal_financas_password ? '••••••••' : 'Não informado'}</p>
                        )}
                      </div>
                    </div>

                    {/* e-Fatura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="e_fatura_user">Utilizador e-Fatura</Label>
                        {isEditing ? (
                          <Input
                            id="e_fatura_user"
                            value={editedProfile?.e_fatura_user || ''}
                            onChange={(e) => handleInputChange('e_fatura_user', e.target.value)}
                            placeholder="utilizador e-Fatura"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.e_fatura_user || 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="e_fatura_password">Password e-Fatura</Label>
                        {isEditing ? (
                          <div className="relative">
                            <Input
                              id="e_fatura_password"
                              type={showPasswords.e_fatura ? 'text' : 'password'}
                              value={editedProfile?.e_fatura_password || ''}
                              onChange={(e) => handleInputChange('e_fatura_password', e.target.value)}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('e_fatura')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                              {showPasswords.e_fatura ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.e_fatura_password ? '••••••••' : 'Não informado'}</p>
                        )}
                      </div>
                    </div>

                    {/* Segurança Social */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ss_direct_user">Utilizador Segurança Social Direta</Label>
                        {isEditing ? (
                          <Input
                            id="ss_direct_user"
                            value={editedProfile?.ss_direct_user || ''}
                            onChange={(e) => handleInputChange('ss_direct_user', e.target.value)}
                            placeholder="utilizador SS"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.ss_direct_user || 'Não informado'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="ss_direct_password">Password Segurança Social Direta</Label>
                        {isEditing ? (
                          <div className="relative">
                            <Input
                              id="ss_direct_password"
                              type={showPasswords.ss_direct ? 'text' : 'password'}
                              value={editedProfile?.ss_direct_password || ''}
                              onChange={(e) => handleInputChange('ss_direct_password', e.target.value)}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('ss_direct')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                              {showPasswords.ss_direct ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-foreground">{profile?.ss_direct_password ? '••••••••' : 'Não informado'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Preferências e Configurações */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Preferências e Configurações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="official_email">Email Oficial (se diferente)</Label>
                      {isEditing ? (
                        <Input
                          id="official_email"
                          type="email"
                          value={editedProfile?.official_email || ''}
                          onChange={(e) => handleInputChange('official_email', e.target.value)}
                          placeholder="oficial@empresa.com"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.official_email || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_software">Software de Faturação</Label>
                      {isEditing ? (
                        <select
                          id="billing_software"
                          value={editedProfile?.billing_software || ''}
                          onChange={(e) => handleInputChange('billing_software', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Selecione</option>
                          <option value="Moloni">Moloni</option>
                          <option value="Primavera">Primavera</option>
                          <option value="PHC">PHC</option>
                          <option value="InvoiceXpress">InvoiceXpress</option>
                          <option value="Outro">Outro</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.billing_software || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferred_format">Formato Preferido de Documentos</Label>
                      {isEditing ? (
                        <select
                          id="preferred_format"
                          value={editedProfile?.preferred_format || ''}
                          onChange={(e) => handleInputChange('preferred_format', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Selecione</option>
                          <option value="digital">Digital</option>
                          <option value="paper">Papel</option>
                          <option value="both">Ambos</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.preferred_format || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferred_contact_hours">Horário Preferido para Contacto</Label>
                      {isEditing ? (
                        <Input
                          id="preferred_contact_hours"
                          value={editedProfile?.preferred_contact_hours || ''}
                          onChange={(e) => handleInputChange('preferred_contact_hours', e.target.value)}
                          placeholder="09:00-18:00"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.preferred_contact_hours || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Company Data Tab */}
        {activeTab === 'additional-company' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-accounting-primary" />
                  Dados Empresariais Adicionais
                </CardTitle>
                <CardDescription>
                  Complete os dados adicionais da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Identificação Adicional da Empresa */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Identificação Adicional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trade_name">Nome Comercial</Label>
                      {isEditing ? (
                        <Input
                          id="trade_name"
                          value={editedProfile?.trade_name || ''}
                          onChange={(e) => handleInputChange('trade_name', e.target.value)}
                          placeholder="Nome comercial da empresa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.trade_name || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="share_capital">Capital Social (€)</Label>
                      {isEditing ? (
                        <Input
                          id="share_capital"
                          type="number"
                          value={editedProfile?.share_capital || ''}
                          onChange={(e) => handleInputChange('share_capital', parseFloat(e.target.value) || 0)}
                          placeholder="5000"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">
                          {profile?.share_capital ? `€${profile.share_capital}` : 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="corporate_object">Objeto Social Detalhado</Label>
                      {isEditing ? (
                        <Textarea
                          id="corporate_object"
                          value={editedProfile?.corporate_object || ''}
                          onChange={(e) => handleInputChange('corporate_object', e.target.value)}
                          placeholder="Descrição detalhada do objeto social da empresa..."
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.corporate_object || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="group_start_date">Data de Início de Atividade</Label>
                      {isEditing ? (
                        <Input
                          id="group_start_date"
                          type="date"
                          value={editedProfile?.group_start_date || ''}
                          onChange={(e) => handleInputChange('group_start_date', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">
                          {profile?.group_start_date ? new Date(profile.group_start_date).toLocaleDateString('pt-PT') : 'Não informado'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Morada da Empresa */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Morada da Empresa (se diferente da fiscal)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={editedProfile?.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Rua da Empresa, 123, 1º Andar"
                          rows={2}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.address || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postal_code">Código Postal</Label>
                      {isEditing ? (
                        <Input
                          id="postal_code"
                          value={editedProfile?.postal_code || ''}
                          onChange={(e) => handleInputChange('postal_code', e.target.value)}
                          placeholder="1234-567"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.postal_code || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editedProfile?.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Lisboa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.city || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="county">Concelho</Label>
                      {isEditing ? (
                        <Input
                          id="county"
                          value={editedProfile?.county || ''}
                          onChange={(e) => handleInputChange('county', e.target.value)}
                          placeholder="Lisboa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.county || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="district">Distrito</Label>
                      {isEditing ? (
                        <Input
                          id="district"
                          value={editedProfile?.district || ''}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          placeholder="Lisboa"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.district || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dados Bancários */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Dados Bancários</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bank_name">Banco Principal</Label>
                      {isEditing ? (
                        <Input
                          id="bank_name"
                          value={editedProfile?.bank_name || ''}
                          onChange={(e) => handleInputChange('bank_name', e.target.value)}
                          placeholder="Banco Comercial Português"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.bank_name || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="iban">IBAN</Label>
                      {isEditing ? (
                        <Input
                          id="iban"
                          value={editedProfile?.iban || ''}
                          onChange={(e) => handleInputChange('iban', e.target.value)}
                          placeholder="PT50 0000 0000 0000 0000 0000 0"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.iban || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bic">BIC/SWIFT</Label>
                      {isEditing ? (
                        <Input
                          id="bic"
                          value={editedProfile?.bic || ''}
                          onChange={(e) => handleInputChange('bic', e.target.value)}
                          placeholder="BCPTPTPL"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.bic || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Informações Operacionais */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Informações Operacionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annual_revenue">Faturação Anual Real (€)</Label>
                      {isEditing ? (
                        <Input
                          id="annual_revenue"
                          type="number"
                          value={editedProfile?.annual_revenue || ''}
                          onChange={(e) => handleInputChange('annual_revenue', parseFloat(e.target.value) || 0)}
                          placeholder="100000"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">
                          {profile?.annual_revenue ? `€${profile.annual_revenue}` : 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="has_stock">Gestão de Stock</Label>
                      {isEditing ? (
                        <input
                          id="has_stock"
                          type="checkbox"
                          checked={editedProfile?.has_stock || false}
                          onChange={(e) => handleInputChange('has_stock', e.target.checked)}
                          className="rounded border-input"
                        />
                      ) : (
                        <Badge variant={profile?.has_stock ? "default" : "secondary"}>
                          {profile?.has_stock ? 'Sim' : 'Não'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Relacionamentos Comerciais */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Relacionamentos Comerciais</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="main_clients">Principais Clientes</Label>
                      {isEditing ? (
                        <Textarea
                          id="main_clients"
                          value={editedProfile?.main_clients || ''}
                          onChange={(e) => handleInputChange('main_clients', e.target.value)}
                          placeholder="Liste os seus principais clientes..."
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.main_clients || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="main_suppliers">Principais Fornecedores</Label>
                      {isEditing ? (
                        <Textarea
                          id="main_suppliers"
                          value={editedProfile?.main_suppliers || ''}
                          onChange={(e) => handleInputChange('main_suppliers', e.target.value)}
                          placeholder="Liste os seus principais fornecedores..."
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-foreground">{profile?.main_suppliers || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions for non-editing mode */}
        {activeTab !== 'registered' && !isEditing && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-accounting-primary hover:bg-accounting-primary/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Completar/Editar Informações
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
