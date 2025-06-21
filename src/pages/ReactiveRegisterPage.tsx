import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/ValidatedInput';
import { 
  type RegisterFormData,
  validateNIFReactive,
  validateNIPCReactive,
  validatePhoneReactive,
  validateEmailReactive,
  validatePostalCodeReactive,
  validateNameReactive,
  validateUsernameLocal
} from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ReactiveRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'personal' | 'company' | 'credentials'>('personal');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nif: '',
      username: '',
      password: '',
      confirmPassword: '',
      company_name: '',
      trade_name: '',
      nipc: '',
      address: '',
      postal_code: '',
      city: '',
      country: 'Portugal',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await registerUser({
        type: 'new-client',
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
        phone: data.phone,
        nif: data.nif,
        address: data.address,
        postalCode: data.postal_code,
        city: data.city,
        businessType: 'other',
      });
      
      navigate('/login', { 
        state: { message: 'Registro realizado com sucesso! Faça login para continuar.' }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar. Tente novamente.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      personal: ['name', 'email', 'phone', 'nif'],
      company: ['company_name', 'nipc', 'address', 'postal_code', 'city'],
      credentials: ['username', 'password', 'confirmPassword']
    }[currentStep];

    const isStepValid = await trigger(fieldsToValidate as (keyof RegisterFormData)[]);
    
    if (isStepValid) {
      if (currentStep === 'personal') setCurrentStep('company');
      else if (currentStep === 'company') setCurrentStep('credentials');
    }
  };

  const prevStep = () => {
    if (currentStep === 'credentials') setCurrentStep('company');
    else if (currentStep === 'company') setCurrentStep('personal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao login
            </Link>
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${currentStep === 'personal' ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep === 'company' ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep === 'credentials' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentStep === 'personal' && 'Dados Pessoais'}
            {currentStep === 'company' && 'Dados da Empresa'}
            {currentStep === 'credentials' && 'Credenciais de Acesso'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'personal' && 'Informe seus dados pessoais para continuar'}
            {currentStep === 'company' && 'Dados da sua empresa (opcional)'}
            {currentStep === 'credentials' && 'Crie suas credenciais de acesso'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Passo 1: Dados Pessoais */}
            {currentStep === 'personal' && (
              <div className="space-y-4">
                <ValidatedInput
                  label="Nome Completo"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                  onValidate={validateNameReactive}
                  placeholder="Digite seu nome completo"
                />

                <ValidatedInput
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                  onValidate={validateEmailReactive}
                  placeholder="seu@email.com"
                />

                <ValidatedInput
                  label="Telefone"
                  {...register('phone')}
                  error={errors.phone?.message}
                  required
                  onValidate={validatePhoneReactive}
                  placeholder="912345678 ou +351 912345678"
                />

                <ValidatedInput
                  label="NIF"
                  {...register('nif')}
                  error={errors.nif?.message}
                  required
                  maxLength={9}
                  onValidate={validateNIFReactive}
                  placeholder="123456789"
                />
              </div>
            )}

            {/* Passo 2: Dados da Empresa */}
            {currentStep === 'company' && (
              <div className="space-y-4">
                <ValidatedInput
                  label="Nome da Empresa"
                  {...register('company_name')}
                  error={errors.company_name?.message}
                  placeholder="Nome da sua empresa (opcional)"
                />

                <ValidatedInput
                  label="Nome Comercial"
                  {...register('trade_name')}
                  error={errors.trade_name?.message}
                  placeholder="Nome comercial (opcional)"
                />

                <ValidatedInput
                  label="NIPC"
                  {...register('nipc')}
                  error={errors.nipc?.message}
                  maxLength={9}
                  onValidate={validateNIPCReactive}
                  placeholder="123456789 (opcional)"
                />

                <ValidatedInput
                  label="Morada"
                  {...register('address')}
                  error={errors.address?.message}
                  placeholder="Rua, número, andar (opcional)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <ValidatedInput
                    label="Código Postal"
                    {...register('postal_code')}
                    error={errors.postal_code?.message}
                    onValidate={validatePostalCodeReactive}
                    placeholder="1234-567"
                  />

                  <ValidatedInput
                    label="Cidade"
                    {...register('city')}
                    error={errors.city?.message}
                    placeholder="Lisboa"
                  />
                </div>
              </div>
            )}

            {/* Passo 3: Credenciais */}
            {currentStep === 'credentials' && (
              <div className="space-y-4">
                <ValidatedInput
                  label="Nome de Utilizador"
                  {...register('username')}
                  error={errors.username?.message}
                  required
                  onValidate={validateUsernameLocal}
                  placeholder="Escolha um nome de utilizador"
                />

                <ValidatedInput
                  label="Senha"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  required
                  placeholder="Mínimo 6 caracteres"
                />

                <ValidatedInput
                  label="Confirmar Senha"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  required
                  placeholder="Digite a senha novamente"
                />
              </div>
            )}

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 'personal'}
              >
                Anterior
              </Button>

              {currentStep !== 'credentials' ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isValid}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
