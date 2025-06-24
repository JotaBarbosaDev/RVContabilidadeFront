import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, FileText, User, Building, Check, Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValidatedInput } from "@/components/ValidatedInput";
import { useValidation } from "@/hooks/useValidation";
import { z } from "zod";
import type { RegisterFormData } from "@/contexts/AuthContext";

type StepType = 'identification' | 'personal-data' | 'fiscal-data' | 'business-questions' | 'company-data' | 'contact-preferences' | 'accounting-info' | 'financial-info' | 'confirmation';

// Tipo para o estado do formulário
interface FormDataState {
  // Campos básicos do registo
  username: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  password?: string;
  confirmPassword?: string;
  
  // Dados pessoais
  date_of_birth: string;
  marital_status: string;
  citizen_card_number: string;
  citizen_card_expiry: string;
  tax_residence_country: string;
  fixed_phone: string;
  
  // Morada fiscal
  fiscal_address: string;
  fiscal_postal_code: string;
  fiscal_city: string;
  fiscal_county: string;
  fiscal_district: string;
  
  // Email oficial e preferências de contacto
  official_email: string;
  billing_software: string;
  preferred_format: string;
  report_frequency: string;
  preferred_contact_hours: string;
  
  // Perguntas condicionais
  has_company: boolean | null;
  is_part_of_group: boolean | null;
  
  // Dados da empresa (condicionais)
  company_name: string;
  n_ip_c: string;
  legal_form: string;
  cae: string;
  founding_date: string;
  accounting_regime: string;
  vat_regime: string;
  business_activity: string;
  estimated_revenue: string;
  monthly_invoices: string;
  number_employees: string;
  trade_name: string;
  corporate_object: string;
  
  // Morada da empresa
  company_address: string;
  company_postal_code: string;
  company_city: string;
  company_county: string;
  company_district: string;
  company_country: string;
  
  // Informações financeiras
  share_capital: string;
  group_start_date: string;
  bank_name: string;
  iban: string;
  bic: string;
  annual_revenue: string;
  has_stock: boolean;
  main_clients: string;
  main_suppliers: string;
  
  // Documentos
  documents: File[];
  
  // Confirmações
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

// Tipo para os dados do backend (PascalCase)
interface BackendRegisterData {
  Username: string;
  Name: string;
  Email: string;
  Phone: string;
  NIF: string;
  PasswordHash: string;
  DateOfBirth: string;
  MaritalStatus: string;
  CitizenCardNumber: string;
  CitizenCardExpiry: string;
  TaxResidenceCountry: string;
  FixedPhone: string;
  FiscalAddress: string;
  FiscalPostalCode: string;
  FiscalCity: string;
  FiscalCounty: string;
  FiscalDistrict: string;
  OfficialEmail: string;
  BillingSoftware: string;
  PreferredFormat: string;
  ReportFrequency: string;
  PreferredContactHours: string;
  // Campos da empresa - opcionais
  CompanyName?: string;
  NIPC?: string;
  LegalForm?: string;
  CAE?: string;
  FoundingDate?: string;
  AccountingRegime?: string;
  VATRegime?: string;
  BusinessActivity?: string;
  EstimatedRevenue?: number | null;
  MonthlyInvoices?: number | null;
  NumberEmployees?: number | null;
  TradeName?: string;
  CorporateObject?: string;
  CompanyAddress?: string;
  CompanyPostalCode?: string;
  CompanyCity?: string;
  CompanyCounty?: string;
  CompanyDistrict?: string;
  CompanyCountry?: string;
  ShareCapital?: number | null;
  GroupStartDate?: string;
  BankName?: string;
  IBAN?: string;
  BIC?: string;
  AnnualRevenue?: number | null;
  HasStock?: boolean;
  MainClients?: string;
  MainSuppliers?: string;
  Documents?: File[];
}

// Schema de validação
const registrationSchema = z.object({
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone deve ter pelo menos 9 dígitos'),
  nif: z.string().length(9, 'NIF deve ter exatamente 9 dígitos'),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  date_of_birth: z.string().min(1, 'Data de nascimento é obrigatória'),
  fiscal_address: z.string().min(5, 'Morada fiscal é obrigatória'),
  fiscal_postal_code: z.string().min(8, 'Código postal é obrigatório'),
  fiscal_city: z.string().min(2, 'Localidade é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As passwords não coincidem",
  path: ["confirmPassword"],
});

export default function CompleteRegisterFormPage() {
  const [currentStep, setCurrentStep] = useState<StepType>('identification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Valores iniciais para validação
  const initialValues = {
    username: '',
    name: '',
    email: '',
    phone: '',
    nif: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    fiscal_address: '',
    fiscal_postal_code: '',
    fiscal_city: '',
  };

  // Hook de validação
  const validation = useValidation(initialValues, {
    schema: registrationSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });
  
  const [formData, setFormData] = useState<FormDataState>(() => {
    // Tentar carregar dados salvos do localStorage
    const savedData = localStorage.getItem('registrationProgress');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        // Se houver erro ao parsear, usar valores padrão
      }
    }
    
    return {
      // Campos básicos do registo
      username: '',
      name: '',
      email: '',
      phone: '',
      nif: '',
      password: '',
      confirmPassword: '',
      
      // Dados pessoais
      date_of_birth: '',
      marital_status: '',
      citizen_card_number: '',
      citizen_card_expiry: '',
      tax_residence_country: 'Portugal',
      fixed_phone: '',
      
      // Morada fiscal
      fiscal_address: '',
      fiscal_postal_code: '',
      fiscal_city: '',
      fiscal_county: '',
      fiscal_district: '',
      
      // Email oficial e preferências de contacto
      official_email: '',
      billing_software: '',
      preferred_format: 'pdf',
      report_frequency: 'trimestral',
      preferred_contact_hours: 'manha',
      
      // Perguntas condicionais
      has_company: null as boolean | null, // null = não respondeu, true/false = respondeu
      is_part_of_group: null as boolean | null, // null = não respondeu, true/false = respondeu
      
      // Dados da empresa (condicionais)
      company_name: '',
      n_ip_c: '',
      legal_form: '',
      cae: '',
      founding_date: '',
      accounting_regime: 'organizada',
      vat_regime: 'normal',
      business_activity: '',
      estimated_revenue: '',
      monthly_invoices: '',
      number_employees: '',
      trade_name: '',
      corporate_object: '',
      
      // Morada da empresa
      company_address: '',
      company_postal_code: '',
      company_city: '',
      company_county: '',
      company_district: '',
      company_country: 'Portugal',
      
      // Informações financeiras
      share_capital: '',
      group_start_date: '', // Condicional se is_part_of_group
      bank_name: '',
      iban: '',
      bic: '',
      annual_revenue: '',
      has_stock: false,
      main_clients: '',
      main_suppliers: '',
      
      // Documentos
      documents: [] as File[],
      
      // Confirmações
      termsAccepted: false,
      dataProcessingAccepted: false
    };
  });

  // Salvar progresso no localStorage sempre que formData mudar
  useEffect(() => {
    // Não salvar passwords no localStorage por segurança
    const dataToSave = { ...formData };
    delete dataToSave.password;
    delete dataToSave.confirmPassword;
    
    localStorage.setItem('registrationProgress', JSON.stringify(dataToSave));
  }, [formData]);

  // Limpar dados salvos quando o registro for bem-sucedido
  const clearSavedProgress = () => {
    localStorage.removeItem('registrationProgress');
  };

  // Steps dinâmicos baseados nas respostas do usuário
  const getDynamicSteps = () => {
    const baseSteps = [
      { id: 'identification', title: 'Identificação', icon: User },
      { id: 'personal-data', title: 'Dados Pessoais', icon: FileText },
      { id: 'fiscal-data', title: 'Dados Fiscais', icon: FileText },
      { id: 'business-questions', title: 'Atividade', icon: Building },
    ];

    // Adicionar steps condicionais baseados na resposta sobre ter empresa
    if (formData.has_company === true) {
      baseSteps.push({ id: 'company-data', title: 'Dados da Empresa', icon: Building });
      baseSteps.push({ id: 'accounting-info', title: 'Info Contabilística', icon: Calculator });
      
      // Só adicionar step financeiro se for uma empresa maior 
      // (parte de grupo ou já tem alguns campos financeiros preenchidos)
      if (formData.is_part_of_group === true || 
          formData.estimated_revenue || 
          formData.monthly_invoices || 
          formData.annual_revenue) {
        baseSteps.push({ id: 'financial-info', title: 'Info Financeira', icon: Calculator });
      }
    }

    baseSteps.push(
      { id: 'contact-preferences', title: 'Preferências', icon: FileText },
      { id: 'confirmation', title: 'Confirmação', icon: Check }
    );

    return baseSteps;
  };

  const steps = getDynamicSteps();

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const isLastStep = () => getCurrentStepIndex() === steps.length - 1;
  const isFirstStep = () => getCurrentStepIndex() === 0;

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    const availableSteps = getDynamicSteps();
    
    if (currentIndex < availableSteps.length - 1) {
      setCurrentStep(availableSteps[currentIndex + 1].id as StepType);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    const availableSteps = getDynamicSteps();
    
    if (currentIndex > 0) {
      setCurrentStep(availableSteps[currentIndex - 1].id as StepType);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const renderStepIndicator = () => (
    <div className="space-y-4 mb-8">
      {/* Contador de progresso */}
      <div className="text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accounting-primary/10 text-accounting-primary">
          Passo {getCurrentStepIndex() + 1} de {steps.length}
          {formData.has_company === true && (
            <span className="ml-2 text-green-600">• Empresa</span>
          )}
          {formData.has_company === false && (
            <span className="ml-2 text-blue-600">• Pessoa Singular</span>
          )}
        </div>
      </div>
      
      {/* Indicadores de passos */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = getCurrentStepIndex() > index;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isActive 
                  ? 'bg-accounting-primary text-white shadow-lg' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-1 mx-2 rounded transition-colors
                  ${isCompleted ? 'bg-green-500' : 'bg-muted'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderIdentificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Identificação Básica</h3>
        <p className="text-muted-foreground">Dados básicos para acesso à plataforma</p>
      </div>

      <div className="grid gap-4">
        <ValidatedInput
          label="Nome de utilizador"
          name="username"
          type="text"
          placeholder="seu_username"
          value={validation.fields.username.value}
          onChange={(e) => validation.setValue('username', e.target.value)}
          error={validation.fields.username.error}
          isValid={validation.fields.username.isValid}
          required
          className="h-11"
        />

        <ValidatedInput
          label="Nome completo"
          name="name"
          type="text"
          placeholder="João Silva"
          value={validation.fields.name.value}
          onChange={(e) => validation.setValue('name', e.target.value)}
          error={validation.fields.name.error}
          isValid={validation.fields.name.isValid}
          required
          className="h-11"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            value={validation.fields.email.value}
            onChange={(e) => validation.setValue('email', e.target.value)}
            error={validation.fields.email.error}
            isValid={validation.fields.email.isValid}
            required
            className="h-11"
          />

          <ValidatedInput
            label="Telemóvel"
            name="phone"
            type="tel"
            placeholder="912 345 678"
            value={validation.fields.phone.value}
            onChange={(e) => validation.setValue('phone', e.target.value)}
            error={validation.fields.phone.error}
            isValid={validation.fields.phone.isValid}
            required
            className="h-11"
          />
        </div>

        <ValidatedInput
          label="NIF"
          name="nif"
          type="text"
          placeholder="123456789"
          value={validation.fields.nif.value}
          onChange={(e) => validation.setValue('nif', e.target.value)}
          error={validation.fields.nif.error}
          isValid={validation.fields.nif.isValid}
          required
          className="h-11"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Palavra-passe"
            name="password"
            type="password"
            placeholder="Digite a sua palavra-passe"
            value={validation.fields.password.value}
            onChange={(e) => validation.setValue('password', e.target.value)}
            error={validation.fields.password.error}
            isValid={validation.fields.password.isValid}
            required
            className="h-11"
          />

          <ValidatedInput
            label="Confirmar palavra-passe"
            name="confirmPassword"
            type="password"
            placeholder="Confirme a sua palavra-passe"
            value={validation.fields.confirmPassword.value}
            onChange={(e) => validation.setValue('confirmPassword', e.target.value)}
            error={validation.fields.confirmPassword.error}
            isValid={validation.fields.confirmPassword.isValid}
            required
            className="h-11"
          />
        </div>
      </div>
    </div>
  );

  const renderPersonalDataStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Dados Pessoais</h3>
        <p className="text-muted-foreground">Informações pessoais complementares</p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Data de nascimento"
            name="date_of_birth"
            type="date"
            value={validation.fields.date_of_birth.value}
            onChange={(e) => validation.setValue('date_of_birth', e.target.value)}
            error={validation.fields.date_of_birth.error}
            isValid={validation.fields.date_of_birth.isValid}
            required
            className="h-11"
          />

          <div className="space-y-2">
            <Label htmlFor="marital_status">Estado civil</Label>
            <Select 
              value={formData.marital_status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, marital_status: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="uniao_facto">União de facto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="citizen_card_number">Número do cartão de cidadão</Label>
            <Input
              id="citizen_card_number"
              type="text"
              placeholder="12345678 9 ZZ0"
              value={formData.citizen_card_number}
              onChange={(e) => setFormData(prev => ({ ...prev, citizen_card_number: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citizen_card_expiry">Validade do cartão de cidadão</Label>
            <Input
              id="citizen_card_expiry"
              type="date"
              value={formData.citizen_card_expiry}
              onChange={(e) => setFormData(prev => ({ ...prev, citizen_card_expiry: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax_residence_country">País de residência fiscal</Label>
            <Input
              id="tax_residence_country"
              type="text"
              value={formData.tax_residence_country}
              onChange={(e) => setFormData(prev => ({ ...prev, tax_residence_country: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixed_phone">Telefone fixo</Label>
            <Input
              id="fixed_phone"
              type="tel"
              placeholder="212 345 678"
              value={formData.fixed_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, fixed_phone: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessQuestionsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Atividade Empresarial</h3>
        <p className="text-muted-foreground">Algumas perguntas para personalizar o seu registo</p>
      </div>

      <div className="grid gap-6">
        {/* Informação explicativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Personalize o seu registo</h4>
          <p className="text-sm text-blue-700">
            Estas perguntas ajudam-nos a adaptar o formulário às suas necessidades específicas. 
            Se tem uma empresa, mostraremos campos relevantes para dados empresariais. 
            Se é apenas pessoa singular, o processo será mais simples e direto.
          </p>
        </div>
        {/* Pergunta principal: Tem empresa? */}
        <div className="space-y-4 p-6 bg-gradient-to-br from-accounting-surface/30 to-background border-2 border-accounting-primary/20 rounded-lg">
          <h4 className="font-semibold text-lg text-accounting-primary">Tem empresa ou atividade empresarial?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione a opção que melhor descreve a sua situação
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, has_company: true }))}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                formData.has_company === true
                  ? 'border-accounting-primary bg-accounting-primary/10 text-accounting-primary shadow-md'
                  : 'border-border hover:border-accounting-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.has_company === true 
                    ? 'bg-accounting-primary border-accounting-primary' 
                    : 'border-gray-300'
                }`}>
                  {formData.has_company === true && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-medium">✅ Sim, tenho empresa</div>
                  <div className="text-sm text-muted-foreground">
                    Tenho uma empresa constituída ou atividade empresarial
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, has_company: false, is_part_of_group: null }))}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                formData.has_company === false
                  ? 'border-accounting-primary bg-accounting-primary/10 text-accounting-primary shadow-md'
                  : 'border-border hover:border-accounting-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.has_company === false 
                    ? 'bg-accounting-primary border-accounting-primary' 
                    : 'border-gray-300'
                }`}>
                  {formData.has_company === false && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-medium">👤 Não, sou pessoa singular</div>
                  <div className="text-sm text-muted-foreground">
                    Preciso apenas de apoio fiscal pessoal
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Pergunta condicional: Faz parte de grupo? */}
        {formData.has_company === true && (
          <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-800">A sua empresa faz parte de um grupo empresarial?</h4>
            <p className="text-sm text-blue-600 mb-4">
              Isto ajuda-nos a saber se precisamos de informações sobre estrutura societária complexa
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_part_of_group: true }))}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                  formData.is_part_of_group === true
                    ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md'
                    : 'border-border hover:border-blue-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.is_part_of_group === true 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {formData.is_part_of_group === true && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">🏢 Sim, faz parte de grupo</div>
                    <div className="text-sm text-muted-foreground">
                      A empresa pertence a um grupo empresarial
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_part_of_group: false }))}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                  formData.is_part_of_group === false
                    ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md'
                    : 'border-border hover:border-blue-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.is_part_of_group === false 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {formData.is_part_of_group === false && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">🏪 Não, é empresa independente</div>
                    <div className="text-sm text-muted-foreground">
                      A empresa não pertence a nenhum grupo
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Informação sobre próximos passos */}
        {formData.has_company !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              <strong>Próximos passos:</strong> {
                formData.has_company 
                  ? "Iremos pedir dados da sua empresa e informações contabilísticas."
                  : "Iremos focar apenas nos seus dados pessoais e preferências de contacto."
              }
            </p>
            {formData.has_company && (
              <p className="text-xs text-green-600 mt-2">
                💡 {formData.is_part_of_group === true 
                    ? "Como faz parte de um grupo, teremos algumas perguntas adicionais sobre a estrutura empresarial." 
                    : formData.is_part_of_group === false 
                      ? "Como é uma empresa independente, o processo será mais direto."
                      : "Responda se faz parte de um grupo empresarial para personalizar o processo."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderFiscalDataStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Dados Fiscais</h3>
        <p className="text-muted-foreground">Morada fiscal e dados para comunicação com as finanças</p>
      </div>

      <div className="grid gap-4">
        <ValidatedInput
          label="Morada fiscal"
          name="fiscal_address"
          type="text"
          placeholder="Rua das Flores, 123, 1º Dto"
          value={validation.fields.fiscal_address.value}
          onChange={(e) => validation.setValue('fiscal_address', e.target.value)}
          error={validation.fields.fiscal_address.error}
          isValid={validation.fields.fiscal_address.isValid}
          required
          className="h-11"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ValidatedInput
            label="Código postal"
            name="fiscal_postal_code"
            type="text"
            placeholder="1000-001"
            value={validation.fields.fiscal_postal_code.value}
            onChange={(e) => validation.setValue('fiscal_postal_code', e.target.value)}
            error={validation.fields.fiscal_postal_code.error}
            isValid={validation.fields.fiscal_postal_code.isValid}
            required
            className="h-11"
          />

          <ValidatedInput
            label="Localidade"
            name="fiscal_city"
            type="text"
            placeholder="Lisboa"
            value={validation.fields.fiscal_city.value}
            onChange={(e) => validation.setValue('fiscal_city', e.target.value)}
            error={validation.fields.fiscal_city.error}
            isValid={validation.fields.fiscal_city.isValid}
            required
            className="h-11"
          />

          <div className="space-y-2">
            <Label htmlFor="fiscal_county">Concelho</Label>
            <Input
              id="fiscal_county"
              type="text"
              placeholder="Lisboa"
              value={formData.fiscal_county}
              onChange={(e) => setFormData(prev => ({ ...prev, fiscal_county: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiscal_district">Distrito</Label>
          <Input
            id="fiscal_district"
            type="text"
            placeholder="Lisboa"
            value={formData.fiscal_district}
            onChange={(e) => setFormData(prev => ({ ...prev, fiscal_district: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="official_email">Email oficial (para comunicações fiscais)</Label>
          <Input
            id="official_email"
            type="email"
            placeholder="oficial@exemplo.com"
            value={formData.official_email}
            onChange={(e) => setFormData(prev => ({ ...prev, official_email: e.target.value }))}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Email usado para comunicações oficiais com entidades fiscais
          </p>
        </div>
      </div>
    </div>
  );

  const renderCompanyDataStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Dados da Empresa</h3>
        <p className="text-muted-foreground">Informações sobre a empresa/atividade</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">
            Nome da empresa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company_name"
            type="text"
            placeholder="Empresa Exemplo, Lda"
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            className="h-11"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="n_ip_c">
              NIPC <span className="text-red-500">*</span>
            </Label>
            <Input
              id="n_ip_c"
              type="text"
              placeholder="123456789"
              value={formData.n_ip_c}
              onChange={(e) => setFormData(prev => ({ ...prev, n_ip_c: e.target.value }))}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_form">
              Forma jurídica <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.legal_form} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, legal_form: value }))}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione a forma jurídica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lda">Sociedade por Quotas (Lda)</SelectItem>
                <SelectItem value="unipessoal">Sociedade Unipessoal</SelectItem>
                <SelectItem value="sa">Sociedade Anónima (SA)</SelectItem>
                <SelectItem value="eni">Empresário em Nome Individual</SelectItem>
                <SelectItem value="individual">Pessoa Singular</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cae">CAE (Código de Atividade Económica)</Label>
            <Input
              id="cae"
              type="text"
              placeholder="12345"
              value={formData.cae}
              onChange={(e) => setFormData(prev => ({ ...prev, cae: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="founding_date">Data de constituição/início de atividade</Label>
            <Input
              id="founding_date"
              type="date"
              value={formData.founding_date}
              onChange={(e) => setFormData(prev => ({ ...prev, founding_date: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trade_name">Nome comercial</Label>
          <Input
            id="trade_name"
            type="text"
            placeholder="Nome comercial da empresa"
            value={formData.trade_name}
            onChange={(e) => setFormData(prev => ({ ...prev, trade_name: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="corporate_object">Objeto social</Label>
          <Textarea
            id="corporate_object"
            placeholder="Descrição da atividade da empresa"
            value={formData.corporate_object}
            onChange={(e) => setFormData(prev => ({ ...prev, corporate_object: e.target.value }))}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_activity">Atividade empresarial</Label>
          <Textarea
            id="business_activity"
            placeholder="Descrição detalhada da atividade desenvolvida"
            value={formData.business_activity}
            onChange={(e) => setFormData(prev => ({ ...prev, business_activity: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>

        {/* Morada da empresa */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-base">Morada da Empresa</h4>
          
          <div className="space-y-2">
            <Label htmlFor="company_address">Morada da empresa</Label>
            <Input
              id="company_address"
              type="text"
              placeholder="Rua Comercial, 456"
              value={formData.company_address}
              onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_postal_code">Código postal</Label>
              <Input
                id="company_postal_code"
                type="text"
                placeholder="2000-002"
                value={formData.company_postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, company_postal_code: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_city">Localidade</Label>
              <Input
                id="company_city"
                type="text"
                placeholder="Porto"
                value={formData.company_city}
                onChange={(e) => setFormData(prev => ({ ...prev, company_city: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_county">Concelho</Label>
              <Input
                id="company_county"
                type="text"
                placeholder="Porto"
                value={formData.company_county}
                onChange={(e) => setFormData(prev => ({ ...prev, company_county: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_district">Distrito</Label>
              <Input
                id="company_district"
                type="text"
                placeholder="Porto"
                value={formData.company_district}
                onChange={(e) => setFormData(prev => ({ ...prev, company_district: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_country">País</Label>
              <Input
                id="company_country"
                type="text"
                value={formData.company_country}
                onChange={(e) => setFormData(prev => ({ ...prev, company_country: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Preferências de Contacto</h3>
        <p className="text-muted-foreground">Como prefere receber as comunicações</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="billing_software">Software de faturação utilizado</Label>
          <Select 
            value={formData.billing_software} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, billing_software: value }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o software" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moloni">Moloni</SelectItem>
              <SelectItem value="invoicexpress">InvoiceXpress</SelectItem>
              <SelectItem value="toconline">TOConline</SelectItem>
              <SelectItem value="primavera">Primavera</SelectItem>
              <SelectItem value="sage">Sage</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
              <SelectItem value="nenhum">Nenhum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_format">Formato preferido para documentos</Label>
            <Select 
              value={formData.preferred_format} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_format: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="papel">Papel físico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report_frequency">Frequência de relatórios</Label>
            <Select 
              value={formData.report_frequency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, report_frequency: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione a frequência" />
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

        <div className="space-y-2">
          <Label htmlFor="preferred_contact_hours">Horário preferido para contacto</Label>
          <Select 
            value={formData.preferred_contact_hours} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_contact_hours: value }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manha">Manhã (9h-12h)</SelectItem>
              <SelectItem value="tarde">Tarde (14h-17h)</SelectItem>
              <SelectItem value="qualquer">Qualquer horário comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderAccountingInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Informações Contabilísticas</h3>
        <p className="text-muted-foreground">Regime e detalhes contabilísticos</p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accounting_regime">Regime de contabilidade</Label>
            <Select 
              value={formData.accounting_regime} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, accounting_regime: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organizada">Contabilidade Organizada</SelectItem>
                <SelectItem value="simplificado">Regime Simplificado</SelectItem>
                <SelectItem value="isencao">Isenção de Contabilidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vat_regime">Regime de IVA</Label>
            <Select 
              value={formData.vat_regime} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, vat_regime: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o regime de IVA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="isento">Isento</SelectItem>
                <SelectItem value="pequenos_retalhistas">Pequenos Retalhistas</SelectItem>
                <SelectItem value="contabilidade_de_caixa">Contabilidade de Caixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated_revenue">Faturação anual estimada (€)</Label>
            <Input
              id="estimated_revenue"
              type="number"
              placeholder="50000"
              value={formData.estimated_revenue}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_revenue: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly_invoices">Nº médio de faturas/mês</Label>
            <Input
              id="monthly_invoices"
              type="number"
              placeholder="50"
              value={formData.monthly_invoices}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly_invoices: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="number_employees">Número de funcionários</Label>
          <Input
            id="number_employees"
            type="number"
            placeholder="5"
            value={formData.number_employees}
            onChange={(e) => setFormData(prev => ({ ...prev, number_employees: e.target.value }))}
            className="h-11"
          />
        </div>
      </div>
    </div>
  );

  const renderFinancialInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Informações Financeiras</h3>
        <p className="text-muted-foreground">Dados bancários e financeiros</p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="share_capital">Capital social (€)</Label>
            <Input
              id="share_capital"
              type="number"
              placeholder="5000"
              value={formData.share_capital}
              onChange={(e) => setFormData(prev => ({ ...prev, share_capital: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_revenue">Faturação anual real (€)</Label>
            <Input
              id="annual_revenue"
              type="number"
              placeholder="75000"
              value={formData.annual_revenue}
              onChange={(e) => setFormData(prev => ({ ...prev, annual_revenue: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="group_start_date">Data de início do grupo</Label>
          <Input
            id="group_start_date"
            type="date"
            value={formData.group_start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, group_start_date: e.target.value }))}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Apenas preencher se aplicável (empresas do mesmo grupo)
          </p>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-base">Dados Bancários</h4>
          
          <div className="space-y-2">
            <Label htmlFor="bank_name">Nome do banco</Label>
            <Input
              id="bank_name"
              type="text"
              placeholder="Banco Exemplo"
              value={formData.bank_name}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                type="text"
                placeholder="PT50 0000 0000 0000 0000 0000 0"
                value={formData.iban}
                onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC/SWIFT</Label>
              <Input
                id="bic"
                type="text"
                placeholder="BKCHPTPL"
                value={formData.bic}
                onChange={(e) => setFormData(prev => ({ ...prev, bic: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-base">Informações Comerciais</h4>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="has_stock"
              checked={formData.has_stock}
              onChange={(e) => setFormData(prev => ({ ...prev, has_stock: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="has_stock" className="cursor-pointer">
              A empresa tem gestão de stock/inventários
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="main_clients">Principais clientes</Label>
            <Textarea
              id="main_clients"
              placeholder="Descreva os seus principais clientes ou tipos de clientes"
              value={formData.main_clients}
              onChange={(e) => setFormData(prev => ({ ...prev, main_clients: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="main_suppliers">Principais fornecedores</Label>
            <Textarea
              id="main_suppliers"
              placeholder="Descreva os seus principais fornecedores ou tipos de fornecedores"
              value={formData.main_suppliers}
              onChange={(e) => setFormData(prev => ({ ...prev, main_suppliers: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Documentos complementares</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Anexe documentos relevantes (certidões, extratos bancários, etc.)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-docs"
              />
              <label htmlFor="file-upload-docs">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Escolher ficheiros
                </Button>
              </label>
            </div>
          </div>
          {formData.documents.length > 0 && (
            <div className="space-y-2">
              {formData.documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Confirmação e Finalização</h3>
        <p className="text-muted-foreground">Revise os dados e finalize o registo</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-3">Resumo do Registo</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo de registo:</span>
            <span className={`font-medium ${formData.has_company ? 'text-blue-600' : 'text-green-600'}`}>
              {formData.has_company ? '🏢 Empresa' : '👤 Pessoa Singular'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span>{validation.fields.name?.value || 'Não informado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">NIF:</span>
            <span>{validation.fields.nif?.value || 'Não informado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{validation.fields.email?.value || 'Não informado'}</span>
          </div>
          {formData.has_company === true && formData.company_name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Empresa:</span>
              <span>{formData.company_name}</span>
            </div>
          )}
          {formData.has_company === true && formData.n_ip_c && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">NIPC:</span>
              <span>{formData.n_ip_c}</span>
            </div>
          )}
          {formData.is_part_of_group === true && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estrutura:</span>
              <span className="text-blue-600">Parte de grupo empresarial</span>
            </div>
          )}
          {formData.documents.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documentos:</span>
              <span>{formData.documents.length} ficheiro(s)</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
            className="w-4 h-4 mt-1"
          />
          <Label htmlFor="termsAccepted" className="text-sm cursor-pointer">
            Li e aceito os{" "}
            <button className="text-accounting-primary hover:underline">
              Termos e Condições
            </button>
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="dataProcessingAccepted"
            checked={formData.dataProcessingAccepted}
            onChange={(e) => setFormData(prev => ({ ...prev, dataProcessingAccepted: e.target.checked }))}
            className="w-4 h-4 mt-1"
          />
          <Label htmlFor="dataProcessingAccepted" className="text-sm cursor-pointer">
            Autorizo o tratamento dos dados pessoais conforme a{" "}
            <button className="text-accounting-primary hover:underline">
              Política de Privacidade
            </button>
          </Label>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          <strong>Próximos passos:</strong> Após o registo, a nossa equipa irá analisar 
          a sua candidatura e entrar em contacto consigo para finalizar o processo de adesão.
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'identification':
        return renderIdentificationStep();
      case 'personal-data':
        return renderPersonalDataStep();
      case 'fiscal-data':
        return renderFiscalDataStep();
      case 'business-questions':
        return renderBusinessQuestionsStep();
      case 'company-data':
        return renderCompanyDataStep();
      case 'contact-preferences':
        return renderContactPreferencesStep();
      case 'accounting-info':
        return renderAccountingInfoStep();
      case 'financial-info':
        return renderFinancialInfoStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return renderIdentificationStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'identification':
        return validation.fields.username?.value && validation.fields.name?.value && 
               validation.fields.email?.value && validation.fields.phone?.value && 
               validation.fields.nif?.value && validation.fields.password?.value && 
               validation.fields.confirmPassword?.value &&
               validation.fields.password?.value === validation.fields.confirmPassword?.value &&
               validation.fields.username?.isValid && validation.fields.name?.isValid &&
               validation.fields.email?.isValid && validation.fields.phone?.isValid &&
               validation.fields.nif?.isValid && validation.fields.password?.isValid &&
               validation.fields.confirmPassword?.isValid;
      case 'personal-data':
        return validation.fields.date_of_birth?.value && validation.fields.date_of_birth?.isValid;
      case 'fiscal-data':
        return validation.fields.fiscal_address?.value && validation.fields.fiscal_postal_code?.value && 
               validation.fields.fiscal_city?.value && validation.fields.fiscal_address?.isValid &&
               validation.fields.fiscal_postal_code?.isValid && validation.fields.fiscal_city?.isValid;
      case 'business-questions':
        // Verificar se respondeu à pergunta principal sobre ter empresa
        return formData.has_company !== undefined && formData.has_company !== null;
      case 'company-data':
        // Se tem empresa, alguns campos básicos são obrigatórios
        if (formData.has_company === true) {
          return formData.company_name && formData.n_ip_c && formData.legal_form;
        }
        return true;
      case 'contact-preferences':
        return true; // Dados opcionais
      case 'accounting-info':
        return true; // Dados opcionais
      case 'financial-info':
        return true; // Dados opcionais
      case 'confirmation':
        return formData.termsAccepted && formData.dataProcessingAccepted;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (validation.fields.password?.value !== validation.fields.confirmPassword?.value) {
      setSubmitError('As palavras-passe não coincidem');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Campos básicos obrigatórios
      const registerData: BackendRegisterData = {
        // Dados básicos sempre obrigatórios
        Username: validation.fields.username?.value || '',
        Name: validation.fields.name?.value || '',
        Email: validation.fields.email?.value || '',
        Phone: validation.fields.phone?.value || '',
        NIF: validation.fields.nif?.value || '',
        PasswordHash: validation.fields.password?.value || '', // Será hashada no backend
        DateOfBirth: validation.fields.date_of_birth?.value || '',
        MaritalStatus: formData.marital_status || '',
        CitizenCardNumber: formData.citizen_card_number || '',
        CitizenCardExpiry: formData.citizen_card_expiry || '',
        TaxResidenceCountry: formData.tax_residence_country || '',
        FixedPhone: formData.fixed_phone || '',
        FiscalAddress: validation.fields.fiscal_address?.value || '',
        FiscalPostalCode: validation.fields.fiscal_postal_code?.value || '',
        FiscalCity: validation.fields.fiscal_city?.value || '',
        FiscalCounty: formData.fiscal_county || '',
        FiscalDistrict: formData.fiscal_district || '',
        OfficialEmail: formData.official_email || '',
        BillingSoftware: formData.billing_software || '',
        PreferredFormat: formData.preferred_format || '',
        ReportFrequency: formData.report_frequency || '',
        PreferredContactHours: formData.preferred_contact_hours || '',
        Documents: formData.documents
      };

      // Apenas adicionar campos da empresa se o usuário tem empresa
      if (formData.has_company === true) {
        registerData.CompanyName = formData.company_name || '';
        registerData.NIPC = formData.n_ip_c || '';
        registerData.LegalForm = formData.legal_form || '';
        registerData.CAE = formData.cae || '';
        registerData.FoundingDate = formData.founding_date || '';
        registerData.AccountingRegime = formData.accounting_regime || '';
        registerData.VATRegime = formData.vat_regime || '';
        registerData.BusinessActivity = formData.business_activity || '';
        registerData.EstimatedRevenue = formData.estimated_revenue ? parseFloat(formData.estimated_revenue) : null;
        registerData.MonthlyInvoices = formData.monthly_invoices ? parseInt(formData.monthly_invoices) : null;
        registerData.NumberEmployees = formData.number_employees ? parseInt(formData.number_employees) : null;
        registerData.TradeName = formData.trade_name || '';
        registerData.CorporateObject = formData.corporate_object || '';
        registerData.CompanyAddress = formData.company_address || '';
        registerData.CompanyPostalCode = formData.company_postal_code || '';
        registerData.CompanyCity = formData.company_city || '';
        registerData.CompanyCounty = formData.company_county || '';
        registerData.CompanyDistrict = formData.company_district || '';
        registerData.CompanyCountry = formData.company_country || '';
        registerData.ShareCapital = formData.share_capital ? parseFloat(formData.share_capital) : null;
        registerData.BankName = formData.bank_name || '';
        registerData.IBAN = formData.iban || '';
        registerData.BIC = formData.bic || '';
        registerData.AnnualRevenue = formData.annual_revenue ? parseFloat(formData.annual_revenue) : null;
        registerData.HasStock = formData.has_stock;
        registerData.MainClients = formData.main_clients || '';
        registerData.MainSuppliers = formData.main_suppliers || '';
        
        // Campos específicos de grupo empresarial
        if (formData.is_part_of_group === true) {
          registerData.GroupStartDate = formData.group_start_date || '';
        }
      }

      console.log('Complete registration data:', registerData);
      console.log('Has company:', formData.has_company);
      console.log('Is part of group:', formData.is_part_of_group);
      console.log('Company fields included:', formData.has_company === true);

      const result = await register(registerData as unknown as RegisterFormData);
      setSubmitSuccess(result.message);
      
      // Limpar dados salvos
      clearSavedProgress();
      
      // Redirect após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erro ao criar registo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accounting-surface/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Back to login */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Link>
          
          <div className="text-xs text-muted-foreground">
            💾 Progresso salvo automaticamente
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-accounting-primary rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Registo Completo de Cliente
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentStep === 'business-questions' 
                ? "Responda algumas perguntas para personalizar o seu formulário"
                : formData.has_company === true 
                  ? "Formulário personalizado para empresas - Preencha os dados necessários"
                  : formData.has_company === false
                    ? "Formulário simplificado para pessoas singulares"
                    : "Preencha todos os dados necessários para criar a sua conta"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {renderStepIndicator()}
            
            <div className="min-h-[500px]">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Registo Criado com Sucesso!</h3>
                  <p className="text-muted-foreground mb-4">{submitSuccess}</p>
                  <p className="text-sm text-muted-foreground">
                    Será redirecionado para a página de login em alguns segundos...
                  </p>
                </div>
              ) : submitError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-red-800">Erro ao Criar Registo</h3>
                  <p className="text-muted-foreground mb-4">{submitError}</p>
                  <Button 
                    onClick={() => setSubmitError(null)}
                    variant="outline"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              ) : (
                renderCurrentStep()
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep()}
                className="px-8"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={isLastStep() ? handleSubmit : handleNext}
                disabled={!canProceed() || isSubmitting}
                className="px-8 bg-accounting-primary hover:bg-accounting-primary/90"
              >
                {isLastStep() ? (
                  isSubmitting ? 'A criar registo...' : 'Finalizar Registo'
                ) : (
                  'Continuar'
                )}
                {!isLastStep() && <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
