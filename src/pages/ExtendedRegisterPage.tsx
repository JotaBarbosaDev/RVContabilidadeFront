import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/ValidatedInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  type RegisterFormData,
  validateNIFReactive,
  validateNIPCReactive,
  validatePhoneReactive,
  validateEmailReactive,
  validatePostalCodeReactive,
  validateNameReactive,
  validateUsernameLocal,
  validateCAEReactive,
  validateDateReactive,
  validateNumberReactive
} from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Building, Settings, Lock, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = 'personal' | 'address' | 'company' | 'business' | 'regimes' | 'credentials' | 'review';

const STEPS: { id: Step; title: string; description: string; icon: LucideIcon }[] = [
  { 
    id: 'personal', 
    title: 'Dados Pessoais', 
    description: 'Nome, email, telefone e identificação',
    icon: User
  },
  { 
    id: 'address', 
    title: 'Morada Fiscal', 
    description: 'Endereço para correspondência oficial',
    icon: Building
  },
  { 
    id: 'company', 
    title: 'Dados da Empresa', 
    description: 'Nome, NIPC, CAE e forma jurídica',
    icon: Building
  },
  { 
    id: 'business', 
    title: 'Atividade Empresarial', 
    description: 'Descrição da atividade e dados operacionais',
    icon: Settings
  },
  { 
    id: 'regimes', 
    title: 'Regimes Fiscais', 
    description: 'Contabilidade, IVA e frequência de relatórios',
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

type ExtendedFormData = RegisterFormData & {
  date_of_birth: string;
  has_company: string; // 'yes' | 'no'
  founding_date?: string;
  business_activity?: string;
  estimated_revenue?: number;
  monthly_invoices?: number;
  number_employees?: number;
  report_frequency?: string;
  confirmPassword: string;
  company_name?: string;
  nipc?: string;
  cae?: string;
  legal_form?: string;
  accounting_regime?: string;
  vat_regime?: string;
};

export default function ExtendedRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
    watch,
  } = useForm<ExtendedFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nif: '',
      date_of_birth: '',
      fiscal_address: '',
      fiscal_postal_code: '',
      fiscal_city: '',
      has_company: 'no', // Default para particulares/IRS
      company_name: '',
      nipc: '',
      cae: '',
      legal_form: 'Lda',
      founding_date: '',
      accounting_regime: 'simplificada', // Default para particulares
      vat_regime: 'isento_art53', // Default para particulares
      business_activity: '',
      estimated_revenue: 0,
      monthly_invoices: 0,
      number_employees: 0,
      report_frequency: 'mensal',
      username: '',
      password: '',
      confirmPassword: '',
      country: 'Portugal',
    }
  });

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);
  const allValues = watch();

  const onSubmit = async (data: ExtendedFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const hasCompany = data.has_company === 'yes';
      
      // Converter para o formato esperado pelo AuthContext
      const registerData = {
        type: 'new-client' as const,
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
        phone: data.phone,
        nif: data.nif,
        // Campos adicionais do registo expandido
        address: data.fiscal_address,
        postalCode: data.fiscal_postal_code,
        city: data.fiscal_city,
        businessType: hasCompany ? data.business_activity || 'Empresa' : 'Particular - IRS',
        accountingRegime: hasCompany ? data.accounting_regime : 'simplificada',
        estimatedRevenue: hasCompany ? (data.estimated_revenue || 0).toString() : '0',
        monthlyDocuments: hasCompany ? (data.monthly_invoices || 0).toString() : '0',
        // Observações com dados específicos baseados se tem empresa ou não
        observations: hasCompany 
          ? `Tem empresa - Data nascimento: ${data.date_of_birth}, Empresa: ${data.company_name}, NIPC: ${data.nipc}, CAE: ${data.cae}, Forma: ${data.legal_form}, Data constituição: ${data.founding_date}, IVA: ${data.vat_regime}, Funcionários: ${data.number_employees}, Relatórios: ${data.report_frequency}`
          : `Particular/IRS - Data nascimento: ${data.date_of_birth}, Sem empresa registada`
      };
      
      await registerUser(registerData);
      
      navigate('/login', { 
        state: { message: 'Registro realizado com sucesso! Aguarde a aprovação para fazer login.' }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar. Tente novamente.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      const hasCompany = getValues('has_company') === 'yes';
      const currentIndex = currentStepIndex;
      let nextIndex = currentIndex + 1;
      
      // Se não tem empresa, saltar passos relacionados com empresa
      if (!hasCompany) {
        if (currentStep === 'address') {
          // Saltar company, business, regimes → ir direto para credentials
          nextIndex = STEPS.findIndex(step => step.id === 'credentials');
        }
      }
      
      if (nextIndex < STEPS.length) {
        setCurrentStep(STEPS[nextIndex].id);
      }
    }
  };

  const prevStep = () => {
    const hasCompany = getValues('has_company') === 'yes';
    const currentIndex = currentStepIndex;
    let prevIndex = currentIndex - 1;
    
    // Se não tem empresa e está nas credenciais, voltar para address
    if (!hasCompany && currentStep === 'credentials') {
      prevIndex = STEPS.findIndex(step => step.id === 'address');
    }
    
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const goToStep = async (stepId: Step) => {
    const targetIndex = STEPS.findIndex(step => step.id === stepId);
    const currentIndex = currentStepIndex;
    
    // Só permite ir para trás ou para o próximo step se este for válido
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId);
    } else if (targetIndex === currentIndex + 1) {
      await nextStep();
    }
  };

  const getFieldsForStep = (step: Step): (keyof ExtendedFormData)[] => {
    switch (step) {
      case 'personal':
        return ['name', 'email', 'phone', 'nif', 'date_of_birth'];
      case 'address':
        return ['fiscal_address', 'fiscal_postal_code', 'fiscal_city', 'has_company'];
      case 'company':
        return ['company_name', 'nipc', 'cae', 'legal_form', 'founding_date'];
      case 'business':
        return ['business_activity', 'estimated_revenue', 'monthly_invoices'];
      case 'regimes':
        return ['accounting_regime', 'vat_regime', 'report_frequency'];
      case 'credentials':
        return ['username', 'password', 'confirmPassword'];
      default:
        return [];
    }
  };

  const isStepComplete = (step: Step): boolean => {
    const hasCompany = getValues('has_company') === 'yes';
    
    // Se não tem empresa, considerar passos da empresa como completos
    if (!hasCompany && ['company', 'business', 'regimes'].includes(step)) {
      return true;
    }
    
    const fields = getFieldsForStep(step);
    return fields.every(field => {
      const value = getValues(field);
      
      // Para campos opcionais quando não tem empresa
      if (!hasCompany) {
        if (['company_name', 'nipc', 'cae', 'legal_form', 'founding_date', 
             'business_activity', 'estimated_revenue', 'monthly_invoices',
             'accounting_regime', 'vat_regime', 'report_frequency'].includes(field as string)) {
          return true; // Considera como válido se não tem empresa
        }
      }
      
      return value !== undefined && value !== '' && value !== 0;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <ValidatedInput
              label="Nome Completo"
              placeholder="João Silva"
              onValidate={(value: string) => validateNameReactive(value)}
              {...register('name')}
              error={errors.name?.message}
              required
            />
            
            <ValidatedInput
              label="Email"
              type="email"
              placeholder="joao@exemplo.com"
              onValidate={(value: string) => validateEmailReactive(value)}
              {...register('email')}
              error={errors.email?.message}
              required
            />
            
            <ValidatedInput
              label="Telefone"
              placeholder="912345678 ou +351 912345678"
              onValidate={(value: string) => validatePhoneReactive(value)}
              {...register('phone')}
              error={errors.phone?.message}
              required
            />
            
            <ValidatedInput
              label="NIF"
              placeholder="123456789"
              onValidate={(value: string) => validateNIFReactive(value)}
              {...register('nif')}
              error={errors.nif?.message}
              required
            />

            <div>
              <Label htmlFor="date_of_birth">Data de Nascimento *</Label>
              <ValidatedInput
                label="Data de Nascimento"
                type="date"
                onValidate={(value: string) => validateDateReactive(value, "Data de nascimento")}
                {...register('date_of_birth')}
                error={errors.date_of_birth?.message}
                required
              />
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fiscal_address">Morada Fiscal *</Label>
              <Textarea
                placeholder="Rua da República, 123, 2º Andar"
                {...register('fiscal_address')}
                className={errors.fiscal_address ? 'border-red-500' : ''}
              />
              {errors.fiscal_address && <p className="text-red-500 text-sm mt-1">{errors.fiscal_address.message}</p>}
            </div>

            <ValidatedInput
              label="Código Postal"
              placeholder="1234-567"
              onValidate={(value: string) => validatePostalCodeReactive(value)}
              {...register('fiscal_postal_code')}
              error={errors.fiscal_postal_code?.message}
              required
            />

            <ValidatedInput
              label="Cidade"
              placeholder="Lisboa"
              {...register('fiscal_city')}
              error={errors.fiscal_city?.message}
              required
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label htmlFor="has_company" className="text-lg font-semibold text-blue-800">
                Tem empresa ou atividade empresarial? *
              </Label>
              <p className="text-sm text-blue-600 mb-3">
                Selecione "Não" se apenas precisa de serviços de IRS particular
              </p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register('has_company')}
                    className="text-blue-600"
                  />
                  <span>Sim, tenho empresa/atividade empresarial</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="no"
                    {...register('has_company')}
                    className="text-blue-600"
                  />
                  <span>Não, apenas preciso de serviços pessoais (IRS)</span>
                </label>
              </div>
              {errors.has_company && <p className="text-red-500 text-sm mt-1">{errors.has_company.message}</p>}
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-4">
            <ValidatedInput
              label="Nome da Empresa"
              placeholder="Tech Solutions Lda"
              {...register('company_name')}
              error={errors.company_name?.message}
              required
            />

            <ValidatedInput
              label="NIPC"
              placeholder="501234567"
              onValidate={(value: string) => validateNIPCReactive(value)}
              {...register('nipc')}
              error={errors.nipc?.message}
              required
            />

            <ValidatedInput
              label="CAE"
              placeholder="62010"
              onValidate={(value: string) => validateCAEReactive(value)}
              {...register('cae')}
              error={errors.cae?.message}
              required
            />

            <div>
              <Label htmlFor="legal_form">Forma Jurídica *</Label>
              <select
                {...register('legal_form')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="Lda">Lda - Sociedade por Quotas</option>
                <option value="SA">SA - Sociedade Anónima</option>
                <option value="Unipessoal">Unipessoal - Sociedade Unipessoal</option>
                <option value="ENI">ENI - Estabelecimento Individual</option>
                <option value="EIRL">EIRL - Estabelecimento Individual de Responsabilidade Limitada</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.legal_form && <p className="text-red-500 text-sm mt-1">{errors.legal_form.message}</p>}
            </div>

            <ValidatedInput
              label="Data de Constituição"
              type="date"
              onValidate={(value: string) => validateDateReactive(value, "Data de constituição")}
              {...register('founding_date')}
              error={errors.founding_date?.message}
              required
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business_activity">Descrição da Atividade *</Label>
              <Textarea
                placeholder="Descreva detalhadamente a atividade principal da empresa..."
                {...register('business_activity')}
                rows={4}
                className={errors.business_activity ? 'border-red-500' : ''}
              />
              {errors.business_activity && <p className="text-red-500 text-sm mt-1">{errors.business_activity.message}</p>}
            </div>

            <ValidatedInput
              label="Faturação Estimada Anual (€)"
              type="number"
              placeholder="50000"
              onValidate={(value: string) => validateNumberReactive(value, "Faturação estimada", 0)}
              {...register('estimated_revenue')}
              error={errors.estimated_revenue?.message}
              required
            />

            <ValidatedInput
              label="Número de Faturas por Mês"
              type="number"
              placeholder="20"
              onValidate={(value: string) => validateNumberReactive(value, "Número de faturas", 0)}
              {...register('monthly_invoices')}
              error={errors.monthly_invoices?.message}
              required
            />

            <ValidatedInput
              label="Número de Funcionários"
              type="number"
              placeholder="5"
              {...register('number_employees')}
              error={errors.number_employees?.message}
            />
          </div>
        );

      case 'regimes':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accounting_regime">Regime de Contabilidade *</Label>
              <select
                {...register('accounting_regime')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="organizada">Contabilidade Organizada</option>
                <option value="simplificada">Contabilidade Simplificada</option>
              </select>
              {errors.accounting_regime && <p className="text-red-500 text-sm mt-1">{errors.accounting_regime.message}</p>}
            </div>

            <div>
              <Label htmlFor="vat_regime">Regime de IVA *</Label>
              <select
                {...register('vat_regime')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="normal">Normal</option>
                <option value="isento_art53">Isento (Art. 53º)</option>
                <option value="pequeno_retalhista">Pequeno Retalhista</option>
              </select>
              {errors.vat_regime && <p className="text-red-500 text-sm mt-1">{errors.vat_regime.message}</p>}
            </div>

            <div>
              <Label htmlFor="report_frequency">Frequência de Relatórios *</Label>
              <select
                {...register('report_frequency')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
              </select>
              {errors.report_frequency && <p className="text-red-500 text-sm mt-1">{errors.report_frequency.message}</p>}
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-4">
            <ValidatedInput
              label="Username"
              placeholder="joao_silva"
              onValidate={(value: string) => validateUsernameLocal(value)}
              {...register('username')}
              error={errors.username?.message}
              required
            />

            <ValidatedInput
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              required
            />

            <ValidatedInput
              label="Confirmar Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
            />
          </div>
        );

      case 'review': {
        const hasCompany = allValues.has_company === 'yes';
        return (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">👤 Dados Pessoais</h3>
              <p><strong>Nome:</strong> {allValues.name}</p>
              <p><strong>Email:</strong> {allValues.email}</p>
              <p><strong>Telefone:</strong> {allValues.phone}</p>
              <p><strong>NIF:</strong> {allValues.nif}</p>
              <p><strong>Data de Nascimento:</strong> {allValues.date_of_birth}</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🏠 Morada Fiscal</h3>
              <p><strong>Endereço:</strong> {allValues.fiscal_address}</p>
              <p><strong>Código Postal:</strong> {allValues.fiscal_postal_code}</p>
              <p><strong>Cidade:</strong> {allValues.fiscal_city}</p>
              <p><strong>Tipo de Cliente:</strong> {hasCompany ? 'Empresarial' : 'Particular (IRS)'}</p>
            </div>

            {hasCompany ? (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🏢 Dados da Empresa</h3>
                  <p><strong>Nome:</strong> {allValues.company_name}</p>
                  <p><strong>NIPC:</strong> {allValues.nipc}</p>
                  <p><strong>CAE:</strong> {allValues.cae}</p>
                  <p><strong>Forma Jurídica:</strong> {allValues.legal_form}</p>
                  <p><strong>Data de Constituição:</strong> {allValues.founding_date}</p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">📊 Atividade Empresarial</h3>
                  <p><strong>Atividade:</strong> {allValues.business_activity}</p>
                  <p><strong>Faturação Estimada:</strong> €{allValues.estimated_revenue}</p>
                  <p><strong>Faturas/Mês:</strong> {allValues.monthly_invoices}</p>
                  <p><strong>Funcionários:</strong> {allValues.number_employees}</p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">⚙️ Regimes Fiscais</h3>
                  <p><strong>Contabilidade:</strong> {allValues.accounting_regime}</p>
                  <p><strong>IVA:</strong> {allValues.vat_regime}</p>
                  <p><strong>Relatórios:</strong> {allValues.report_frequency}</p>
                </div>
              </>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold mb-2 text-green-800">📋 Serviços Solicitados</h3>
                <p className="text-green-700">✓ Declaração de IRS</p>
                <p className="text-green-700">✓ Assessoria fiscal pessoal</p>
                <p className="text-green-700">✓ Apoio em questões tributárias</p>
                <p className="text-sm text-green-600 mt-2">
                  <em>Caso futuramente precise de serviços empresariais, pode adicionar no seu perfil após aprovação.</em>
                </p>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔐 Credenciais</h3>
              <p><strong>Username:</strong> {allValues.username}</p>
              <p><strong>Password:</strong> ••••••••</p>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accounting-surface/30 via-background to-accounting-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = isStepComplete(step.id) && index < currentStepIndex;
              const isAccessible = index <= currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isActive
                        ? 'bg-accounting-primary text-white border-accounting-primary'
                        : isCompleted
                        ? 'bg-accounting-success text-white border-accounting-success'
                        : isAccessible
                        ? 'bg-background border-accounting-primary text-accounting-primary hover:bg-accounting-primary/10'
                        : 'bg-muted border-muted-foreground/30 text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-accounting-success' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {STEPS[currentStepIndex].title}
            </h2>
            <p className="text-muted-foreground text-sm">
              {STEPS[currentStepIndex].description}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-accounting-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-accounting-primary/5 to-accounting-secondary/5">
            <CardTitle className="text-accounting-primary text-center">
              RV Contabilidade - Registo de Cliente
            </CardTitle>
            <CardDescription className="text-center">
              Passo {currentStepIndex + 1} de {STEPS.length}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}
              
              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {submitError}
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <div>
                  {currentStepIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {currentStep !== 'review' ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-accounting-primary hover:bg-accounting-primary/90 flex items-center gap-2"
                    >
                      Próximo
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="bg-accounting-success hover:bg-accounting-success/90 flex items-center gap-2"
                    >
                      {isSubmitting ? 'Enviando...' : 'Finalizar Registo'}
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            Já tem conta?{' '}
            <Link to="/login" className="text-accounting-primary hover:underline">
              Fazer login
            </Link>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
