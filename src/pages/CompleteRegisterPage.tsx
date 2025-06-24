import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/ValidatedInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateNIFReactive,
  validatePhoneReactive,
  validateEmailReactive,
  validatePostalCodeReactive,
  validateNameReactive,
  validateUsernameLocal,
  validateCAEReactive,
  validateDateReactive
} from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Building, Settings, Lock, CheckCircle, MapPin, Briefcase, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = 'personal' | 'fiscal-address' | 'company-basic' | 'company-details' | 'company-operational' | 'company-banking' | 'preferences' | 'credentials' | 'review';

const STEPS: { id: Step; title: string; description: string; icon: LucideIcon }[] = [
  { 
    id: 'personal', 
    title: 'Dados Pessoais', 
    description: 'Nome, email, telefone, NIF e dados pessoais',
    icon: User
  },
  { 
    id: 'fiscal-address', 
    title: 'Morada Fiscal', 
    description: 'Endereço para correspondência oficial',
    icon: MapPin
  },
  { 
    id: 'company-basic', 
    title: 'Empresa - Básico', 
    description: 'Nome da empresa e forma jurídica',
    icon: Building
  },
  { 
    id: 'company-details', 
    title: 'Empresa - Detalhes', 
    description: 'CAE, NIPC, dados de constituição',
    icon: Briefcase
  },
  { 
    id: 'company-operational', 
    title: 'Dados Operacionais', 
    description: 'Atividade, faturação, funcionários',
    icon: Settings
  },
  { 
    id: 'company-banking', 
    title: 'Dados Bancários', 
    description: 'Informações bancárias da empresa',
    icon: FileText
  },
  { 
    id: 'preferences', 
    title: 'Preferências', 
    description: 'Software, formatos e contactos',
    icon: Settings
  },
  { 
    id: 'credentials', 
    title: 'Credenciais', 
    description: 'Username e password de acesso',
    icon: Lock
  },
  { 
    id: 'review', 
    title: 'Revisão', 
    description: 'Confirme todos os dados antes de submeter',
    icon: CheckCircle
  }
];

// Tipos conforme especificação
type CompleteFormData = {
  // === OBRIGATÓRIOS ===
  username: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  password: string;
  confirmPassword: string;
  fiscal_address: string;
  fiscal_postal_code: string;
  fiscal_city: string;
  company_name: string;
  legal_form: string;

  // === OPCIONAIS PESSOAIS ===
  date_of_birth?: string;
  marital_status?: string;
  citizen_card_number?: string;
  citizen_card_expiry?: string;
  tax_residence_country?: string;
  fixed_phone?: string;
  fiscal_county?: string;
  fiscal_district?: string;

  // === OPCIONAIS PREFERÊNCIAS ===
  official_email?: string;
  billing_software?: string;
  preferred_format?: string;
  report_frequency?: string;
  preferred_contact_hours?: string;

  // === OPCIONAIS EMPRESA BÁSICOS ===
  cae?: string;
  nipc?: string;
  founding_date?: string;
  accounting_regime?: string;
  vat_regime?: string;

  // === OPCIONAIS EMPRESA OPERACIONAIS ===
  business_activity?: string;
  estimated_revenue?: string;
  monthly_invoices?: number;
  number_employees?: number;
  annual_revenue?: number;
  has_stock?: boolean;
  main_clients?: string;
  main_suppliers?: string;

  // === OPCIONAIS EMPRESA COMPLETOS ===
  trade_name?: string;
  corporate_object?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  county?: string;
  district?: string;
  country?: string;
  share_capital?: number;
  group_start_date?: string;

  // === OPCIONAIS BANCÁRIOS ===
  bank_name?: string;
  iban?: string;
  bic?: string;
};

export default function CompleteRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<CompleteFormData>({
    mode: 'onChange',
    defaultValues: {
      // Obrigatórios
      username: '',
      name: '',
      email: '',
      phone: '',
      nif: '',
      password: '',
      confirmPassword: '',
      fiscal_address: '',
      fiscal_postal_code: '',
      fiscal_city: '',
      company_name: '',
      legal_form: 'Sociedade por Quotas',

      // Opcionais com defaults
      country: 'Portugal',
      tax_residence_country: 'Portugal',
      preferred_format: 'digital',
      report_frequency: 'mensal',
      accounting_regime: 'organizada',
      vat_regime: 'normal',
      has_stock: false,
    }
  });

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);

  const onSubmit = async (data: CompleteFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Converter para o formato esperado pelo AuthContext
      const registerData = {
        type: 'new-client' as const,
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
        phone: data.phone,
        nif: data.nif,
        
        // Morada fiscal obrigatória
        fiscalAddress: data.fiscal_address,
        fiscalPostalCode: data.fiscal_postal_code,
        fiscalCity: data.fiscal_city,
        
        // Dados da empresa obrigatórios - Note que não incluímos NIPC pois não é mais obrigatório
        // company_name será mapeado no AuthContext
        
        // Campos opcionais (só enviar se preenchidos)
        ...(data.date_of_birth && { dateOfBirth: data.date_of_birth }),
        ...(data.cae && { businessActivity: `CAE: ${data.cae}` }),
        ...(data.nipc && { nipc: data.nipc }),
        ...(data.founding_date && { foundingDate: data.founding_date }),
        ...(data.accounting_regime && { accountingRegime: data.accounting_regime }),
        ...(data.vat_regime && { vatRegime: data.vat_regime }),
        ...(data.business_activity && { businessActivity: data.business_activity }),
        ...(data.estimated_revenue && { estimatedRevenue: data.estimated_revenue }),
        ...(data.monthly_invoices && { monthlyDocuments: data.monthly_invoices.toString() }),
        ...(data.report_frequency && { reportFrequency: data.report_frequency }),
        
        // Observações com dados completos
        observations: [
          `Empresa: ${data.company_name}`,
          `Forma jurídica: ${data.legal_form}`,
          data.nipc && `NIPC: ${data.nipc}`,
          data.trade_name && `Nome comercial: ${data.trade_name}`,
          data.corporate_object && `Objeto social: ${data.corporate_object}`,
          data.number_employees && `Funcionários: ${data.number_employees}`,
          data.has_stock !== undefined && `Stock: ${data.has_stock ? 'Sim' : 'Não'}`,
          data.main_clients && `Principais clientes: ${data.main_clients}`,
          data.main_suppliers && `Principais fornecedores: ${data.main_suppliers}`,
          data.bank_name && `Banco: ${data.bank_name}`,
          data.iban && `IBAN: ${data.iban}`,
          data.official_email && `Email oficial: ${data.official_email}`,
          data.billing_software && `Software faturação: ${data.billing_software}`,
          data.preferred_format && `Formato preferido: ${data.preferred_format}`,
          data.preferred_contact_hours && `Horário contacto: ${data.preferred_contact_hours}`,
        ].filter(Boolean).join(' | '),
      };
      
      await registerUser(registerData);
      
      navigate('/login', { 
        state: { message: 'Registo realizado com sucesso! Aguarde a aprovação para fazer login.' }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registar. Tente novamente.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < STEPS.length) {
        setCurrentStep(STEPS[nextIndex].id);
      }
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const goToStep = async (stepId: Step) => {
    const targetIndex = STEPS.findIndex(step => step.id === stepId);
    const currentIndex = currentStepIndex;
    
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId);
    } else if (targetIndex === currentIndex + 1) {
      await nextStep();
    }
  };

  const getFieldsForStep = (step: Step): (keyof CompleteFormData)[] => {
    switch (step) {
      case 'personal':
        return ['name', 'email', 'phone', 'nif'];
      case 'fiscal-address':
        return ['fiscal_address', 'fiscal_postal_code', 'fiscal_city'];
      case 'company-basic':
        return ['company_name', 'legal_form'];
      case 'company-details':
        return [];
      case 'company-operational':
        return [];
      case 'company-banking':
        return [];
      case 'preferences':
        return [];
      case 'credentials':
        return ['username', 'password', 'confirmPassword'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Nome Completo"
                placeholder="João Silva"
                onValidate={(value: string) => validateNameReactive(value)}
                {...register('name', { required: 'Nome é obrigatório' })}
                error={errors.name?.message}
                required
              />
              
              <ValidatedInput
                label="Email"
                type="email"
                placeholder="joao@exemplo.com"
                onValidate={(value: string) => validateEmailReactive(value)}
                {...register('email', { required: 'Email é obrigatório' })}
                error={errors.email?.message}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Telefone"
                placeholder="912345678"
                onValidate={(value: string) => validatePhoneReactive(value)}
                {...register('phone', { required: 'Telefone é obrigatório' })}
                error={errors.phone?.message}
                required
              />
              
              <ValidatedInput
                label="NIF"
                placeholder="123456789"
                onValidate={(value: string) => validateNIFReactive(value)}
                {...register('nif', { required: 'NIF é obrigatório' })}
                error={errors.nif?.message}
                required
              />
            </div>

            {/* Campos opcionais pessoais */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Dados Pessoais Opcionais</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Data de Nascimento"
                  type="date"
                  onValidate={(value: string) => validateDateReactive(value, "Data de nascimento")}
                  {...register('date_of_birth')}
                  error={errors.date_of_birth?.message}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="marital_status">Estado Civil</Label>
                  <Select onValueChange={(value) => setValue('marital_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro">Solteiro</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viúvo">Viúvo</SelectItem>
                      <SelectItem value="União de Facto">União de Facto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ValidatedInput
                  label="Número do Cartão de Cidadão"
                  placeholder="12345678 1 ZZ1"
                  {...register('citizen_card_number')}
                  error={errors.citizen_card_number?.message}
                />
                
                <ValidatedInput
                  label="Validade do Cartão de Cidadão"
                  type="date"
                  {...register('citizen_card_expiry')}
                  error={errors.citizen_card_expiry?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ValidatedInput
                  label="País de Residência Fiscal"
                  placeholder="Portugal"
                  {...register('tax_residence_country')}
                  error={errors.tax_residence_country?.message}
                />
                
                <ValidatedInput
                  label="Telefone Fixo"
                  placeholder="213456789"
                  {...register('fixed_phone')}
                  error={errors.fixed_phone?.message}
                />
              </div>
            </div>
          </div>
        );

      case 'fiscal-address':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Morada Fiscal Obrigatória</h3>
            
            <ValidatedInput
              label="Morada Fiscal"
              placeholder="Rua das Flores, 123"
              onValidate={(value: string) => ({ isValid: value.length >= 5, error: value.length < 5 ? 'Morada deve ter pelo menos 5 caracteres' : undefined })}
              {...register('fiscal_address', { required: 'Morada fiscal é obrigatória' })}
              error={errors.fiscal_address?.message}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Código Postal"
                placeholder="1000-001"
                onValidate={(value: string) => validatePostalCodeReactive(value)}
                {...register('fiscal_postal_code', { required: 'Código postal é obrigatório' })}
                error={errors.fiscal_postal_code?.message}
                required
              />
              
              <ValidatedInput
                label="Cidade"
                placeholder="Lisboa"
                {...register('fiscal_city', { required: 'Cidade é obrigatória' })}
                error={errors.fiscal_city?.message}
                required
              />
            </div>

            {/* Campos opcionais da morada */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Morada Fiscal Opcional</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Concelho"
                  placeholder="Lisboa"
                  {...register('fiscal_county')}
                  error={errors.fiscal_county?.message}
                />
                
                <ValidatedInput
                  label="Distrito"
                  placeholder="Lisboa"
                  {...register('fiscal_district')}
                  error={errors.fiscal_district?.message}
                />
              </div>
            </div>
          </div>
        );

      case 'company-basic':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Dados da Empresa Obrigatórios</h3>
            
            <ValidatedInput
              label="Nome da Empresa"
              placeholder="Silva & Associados Lda"
              {...register('company_name', { required: 'Nome da empresa é obrigatório' })}
              error={errors.company_name?.message}
              required
            />
            
            <div className="space-y-2">
              <Label htmlFor="legal_form" className="text-sm font-medium">
                Forma Jurídica
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('legal_form', value)} defaultValue="Sociedade por Quotas">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma jurídica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sociedade por Quotas">Sociedade por Quotas</SelectItem>
                  <SelectItem value="Sociedade Anónima">Sociedade Anónima</SelectItem>
                  <SelectItem value="Sociedade Unipessoal por Quotas">Sociedade Unipessoal por Quotas</SelectItem>
                  <SelectItem value="Empresário em Nome Individual">Empresário em Nome Individual</SelectItem>
                  <SelectItem value="EIRL">EIRL</SelectItem>
                  <SelectItem value="Cooperativa">Cooperativa</SelectItem>
                  <SelectItem value="Associação">Associação</SelectItem>
                  <SelectItem value="Fundação">Fundação</SelectItem>
                  <SelectItem value="Outra">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'company-details':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Detalhes da Empresa (Opcional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="CAE"
                placeholder="69200"
                onValidate={(value: string) => value ? validateCAEReactive(value) : { isValid: true }}
                {...register('cae')}
                error={errors.cae?.message}
              />
              
              <ValidatedInput
                label="NIPC"
                placeholder="123456789"
                {...register('nipc')}
                error={errors.nipc?.message}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Data de Constituição"
                type="date"
                onValidate={(value: string) => value ? validateDateReactive(value, "Data de constituição") : { isValid: true }}
                {...register('founding_date')}
                error={errors.founding_date?.message}
              />
              
              <ValidatedInput
                label="Data Início de Grupo"
                type="date"
                {...register('group_start_date')}
                error={errors.group_start_date?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accounting_regime">Regime Contabilístico</Label>
                <Select onValueChange={(value) => setValue('accounting_regime', value)} defaultValue="organizada">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organizada">Organizada</SelectItem>
                    <SelectItem value="simplificada">Simplificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vat_regime">Regime de IVA</Label>
                <Select onValueChange={(value) => setValue('vat_regime', value)} defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="isento_art53">Isento art. 53º</SelectItem>
                    <SelectItem value="pequeno_retalhista">Pequeno Retalhista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Nome Comercial"
                placeholder="Silva Consultoria"
                {...register('trade_name')}
                error={errors.trade_name?.message}
              />
              
              <ValidatedInput
                label="Capital Social"
                type="number"
                placeholder="5000.00"
                {...register('share_capital')}
                error={errors.share_capital?.message}
              />
            </div>

            <ValidatedInput
              label="Objeto Social"
              placeholder="Prestação de serviços de consultoria"
              {...register('corporate_object')}
              error={errors.corporate_object?.message}
            />
          </div>
        );

      case 'company-operational':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Dados Operacionais (Opcional)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_activity">Descrição da Atividade</Label>
                <Textarea
                  id="business_activity"
                  placeholder="Consultoria em gestão empresarial, análise financeira..."
                  {...register('business_activity')}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Faturação Estimada (€)"
                  type="number"
                  placeholder="50000.00"
                  {...register('estimated_revenue')}
                  error={errors.estimated_revenue?.message}
                />
                
                <ValidatedInput
                  label="Faturação Anual (€)"
                  type="number"
                  placeholder="100000.00"
                  {...register('annual_revenue')}
                  error={errors.annual_revenue?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Faturas Mensais"
                  type="number"
                  placeholder="10"
                  {...register('monthly_invoices')}
                  error={errors.monthly_invoices?.message}
                />
                
                <ValidatedInput
                  label="Número de Funcionários"
                  type="number"
                  placeholder="2"
                  {...register('number_employees')}
                  error={errors.number_employees?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="has_stock">Tem Stock?</Label>
                <Select onValueChange={(value) => setValue('has_stock', value === 'true')} defaultValue="false">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Não</SelectItem>
                    <SelectItem value="true">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main_clients">Principais Clientes</Label>
                  <Textarea
                    id="main_clients"
                    placeholder="Cliente A, Cliente B, Cliente C..."
                    {...register('main_clients')}
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="main_suppliers">Principais Fornecedores</Label>
                  <Textarea
                    id="main_suppliers"
                    placeholder="Fornecedor X, Fornecedor Y..."
                    {...register('main_suppliers')}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'company-banking':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Dados Bancários (Opcional)</h3>
            
            <ValidatedInput
              label="Nome do Banco"
              placeholder="Banco Comercial Português"
              {...register('bank_name')}
              error={errors.bank_name?.message}
            />
            
            <ValidatedInput
              label="IBAN"
              placeholder="PT50000201231234567890154"
              {...register('iban')}
              error={errors.iban?.message}
            />
            
            <ValidatedInput
              label="BIC/SWIFT"
              placeholder="BCOMPTPL"
              {...register('bic')}
              error={errors.bic?.message}
            />
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Preferências e Contactos (Opcional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Email Oficial da Empresa"
                type="email"
                placeholder="geral@empresa.com"
                {...register('official_email')}
                error={errors.official_email?.message}
              />
              
              <ValidatedInput
                label="Software de Faturação"
                placeholder="Moloni, Sage, PHC..."
                {...register('billing_software')}
                error={errors.billing_software?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_format">Formato Preferido</Label>
                <Select onValueChange={(value) => setValue('preferred_format', value)} defaultValue="digital">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="papel">Papel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report_frequency">Frequência de Relatórios</Label>
                <Select onValueChange={(value) => setValue('report_frequency', value)} defaultValue="mensal">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ValidatedInput
              label="Horário de Contacto Preferido"
              placeholder="9h-17h"
              {...register('preferred_contact_hours')}
              error={errors.preferred_contact_hours?.message}
            />
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Credenciais de Acesso</h3>
            
            <ValidatedInput
              label="Username"
              placeholder="joao.silva"
              onValidate={(value: string) => validateUsernameLocal(value)}
              {...register('username', { required: 'Username é obrigatório' })}
              error={errors.username?.message}
              required
            />
            
            <ValidatedInput
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password é obrigatória', minLength: { value: 6, message: 'Password deve ter pelo menos 6 caracteres' } })}
              error={errors.password?.message}
              required
            />
            
            <ValidatedInput
              label="Confirmar Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Confirmação de password é obrigatória',
                validate: (value) => value === getValues('password') || 'As passwords não coincidem'
              })}
              error={errors.confirmPassword?.message}
              required
            />
          </div>
        );

      case 'review': {
        const formValues = getValues();
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Revisão dos Dados</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Nome: {formValues.name}</span>
                  <span>Email: {formValues.email}</span>
                  <span>Telefone: {formValues.phone}</span>
                  <span>NIF: {formValues.nif}</span>
                  {formValues.date_of_birth && <span>Data Nascimento: {formValues.date_of_birth}</span>}
                  {formValues.marital_status && <span>Estado Civil: {formValues.marital_status}</span>}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Morada Fiscal</h4>
                <div className="text-sm">
                  <p>{formValues.fiscal_address}</p>
                  <p>{formValues.fiscal_postal_code} {formValues.fiscal_city}</p>
                  {formValues.fiscal_county && <p>Concelho: {formValues.fiscal_county}</p>}
                  {formValues.fiscal_district && <p>Distrito: {formValues.fiscal_district}</p>}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Empresa</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Nome: {formValues.company_name}</span>
                  <span>Forma Jurídica: {formValues.legal_form}</span>
                  {formValues.cae && <span>CAE: {formValues.cae}</span>}
                  {formValues.nipc && <span>NIPC: {formValues.nipc}</span>}
                  {formValues.founding_date && <span>Data Constituição: {formValues.founding_date}</span>}
                  {formValues.accounting_regime && <span>Regime Contabilístico: {formValues.accounting_regime}</span>}
                  {formValues.vat_regime && <span>Regime IVA: {formValues.vat_regime}</span>}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Credenciais</h4>
                <div className="text-sm">
                  <span>Username: {formValues.username}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao login
            </Link>
            
            {/* Indicador de progresso */}
            <div className="flex space-x-1">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentStepIndex
                      ? 'bg-blue-500'
                      : index < currentStepIndex
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => goToStep(step.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            {STEPS[currentStepIndex] && (
              (() => {
                const Icon = STEPS[currentStepIndex].icon;
                return <Icon className="h-8 w-8 text-blue-500 mr-3" />;
              })()
            )}
            <div>
              <CardTitle className="text-2xl font-bold">
                {STEPS[currentStepIndex]?.title}
              </CardTitle>
              <CardDescription>
                {STEPS[currentStepIndex]?.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Passo {currentStepIndex + 1} de {STEPS.length}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {currentStep === 'review' ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'A registar...' : 'Confirmar Registo'}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
