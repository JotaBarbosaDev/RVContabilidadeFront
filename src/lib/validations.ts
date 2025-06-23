import { z } from 'zod';

// Validação de NIF português (9 dígitos)
const nifRegex = /^\d{9}$/;
const validateNIF = (nif: string): boolean => {
  if (!nifRegex.test(nif)) return false;
  
  const digits = nif.split('').map(Number);
  const checkDigit = digits[8];
  
  // Algoritmo de validação do NIF português
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * (9 - i);
  }
  
  const remainder = sum % 11;
  const calculatedCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return calculatedCheckDigit === checkDigit;
};

// Validação de NIPC português (9 dígitos)
const validateNIPC = (nipc: string): boolean => {
  if (!nifRegex.test(nipc)) return false;
  // NIPC usa o mesmo algoritmo do NIF
  return validateNIF(nipc);
};

// Validação de código postal português (XXXX-XXX)
const postalCodeRegex = /^\d{4}-\d{3}$/;

// Validação de telefone português
const phoneRegex = /^(\+351\s?)?[2-9]\d{8}$/;

// Schema para dados pessoais/identificação
export const identificationSchema = z.object({
  nif: z
    .string()
    .min(1, 'NIF é obrigatório')
    .regex(nifRegex, 'NIF deve ter 9 dígitos')
    .refine(validateNIF, 'NIF inválido'),
  
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode exceder 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email não pode exceder 100 caracteres'),
  
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(phoneRegex, 'Telefone inválido (ex: 912345678 ou +351 912345678)'),
  
  address: z
    .string()
    .min(5, 'Morada deve ter pelo menos 5 caracteres')
    .max(200, 'Morada não pode exceder 200 caracteres'),
  
  postalCode: z
    .string()
    .min(1, 'Código postal é obrigatório')
    .regex(postalCodeRegex, 'Código postal inválido (formato: 1234-567)'),
  
  city: z
    .string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade não pode exceder 50 caracteres'),
});

// Schema para dados da empresa
export const companySchema = z.object({
  companyName: z
    .string()
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(100, 'Nome da empresa não pode exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  tradeName: z
    .string()
    .max(100, 'Nome comercial não pode exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  nipc: z
    .string()
    .optional()
    .refine((val) => !val || validateNIPC(val), 'NIPC inválido')
    .or(z.literal('')),
  
  legalForm: z
    .string()
    .min(1, 'Forma jurídica é obrigatória')
    .optional()
    .or(z.literal('')),
  
  cae: z
    .string()
    .regex(/^\d{5}$/, 'CAE deve ter 5 dígitos')
    .optional()
    .or(z.literal('')),
  
  shareCapital: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Capital social deve ser um valor numérico válido')
    .optional()
    .or(z.literal('')),
});

// Schema completo do formulário
export const registrationSchema = identificationSchema.merge(companySchema).extend({
  businessType: z.enum(['individual', 'sole-trader', 'company', 'other'], {
    required_error: 'Tipo de negócio é obrigatório'
  }).optional(),
  
  businessTypeOther: z
    .string()
    .max(100, 'Descrição não pode exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  estimatedRevenue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Faturação deve ser um valor numérico válido')
    .optional()
    .or(z.literal('')),
  
  accountingRegime: z
    .enum(['simplified', 'general', 'other'], {
      required_error: 'Regime contabilístico é obrigatório'
    })
    .optional(),
});

// Tipos TypeScript gerados a partir dos schemas
export type IdentificationData = z.infer<typeof identificationSchema>;
export type CompanyData = z.infer<typeof companySchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;

// Helper para obter mensagens de erro específicas
export const getFieldError = (fieldName: string, errors: Record<string, { message?: string }>): string | undefined => {
  const error = errors[fieldName];
  return error?.message;
};

// Schemas individuais para validação direta
const nameSchema = z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo");
const emailSchema = z.string().email("Email inválido").min(5, "Email muito curto");
const phoneSchema = z.string().regex(phoneRegex, "Telefone inválido");
const nifSchema = z.string().regex(nifRegex, "NIF deve ter 9 dígitos").refine(validateNIF, "NIF inválido");
const usernameSchema = z.string().min(3, "Username deve ter pelo menos 3 caracteres").max(50, "Username muito longo");
const passwordSchema = z.string().min(6, "Senha deve ter pelo menos 6 caracteres");

// Validações diretas para cada campo específico
export const validateSingleField = {
  name: (value: string) => {
    try {
      nameSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Nome inválido' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  },
  
  email: (value: string) => {
    try {
      emailSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Email inválido' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  },
  
  nif: (value: string) => {
    try {
      nifSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'NIF inválido' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  },
  
  phone: (value: string) => {
    try {
      phoneSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Telefone inválido' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  },
  
  username: (value: string) => {
    try {
      usernameSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Username inválido' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  },
  
  password: (value: string) => {
    try {
      passwordSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Senha inválida' };
      }
      return { isValid: false, error: 'Erro de validação' };
    }
  }
};

// Funções de validação reativa para feedback em tempo real
export const validateNIFReactive = (nif: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!nif) return { isValid: false, error: "NIF é obrigatório" };
  if (nif.length < 9) return { isValid: false, hint: `Faltam ${9 - nif.length} dígitos` };
  if (nif.length > 9) return { isValid: false, error: "NIF deve ter exatamente 9 dígitos" };
  if (!/^\d{9}$/.test(nif)) return { isValid: false, error: "NIF só pode conter números" };
  if (!validateNIF(nif)) return { isValid: false, error: "NIF inválido (dígito de controle incorreto)" };
  return { isValid: true, hint: "NIF válido" };
};

export const validateNIPCReactive = (nipc: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!nipc) return { isValid: true, hint: "NIPC é opcional" };
  if (nipc.length < 9) return { isValid: false, hint: `Faltam ${9 - nipc.length} dígitos` };
  if (nipc.length > 9) return { isValid: false, error: "NIPC deve ter exatamente 9 dígitos" };
  if (!/^\d{9}$/.test(nipc)) return { isValid: false, error: "NIPC só pode conter números" };
  if (!validateNIPC(nipc)) return { isValid: false, error: "NIPC inválido (dígito de controle incorreto)" };
  return { isValid: true, hint: "NIPC válido" };
};

export const validatePhoneReactive = (phone: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!phone) return { isValid: false, error: "Telefone é obrigatório" };
  if (phone.length < 9) return { isValid: false, hint: `Faltam ${9 - phone.length} dígitos` };
  if (!/^(\+351\s?)?[2-9]\d{8}$/.test(phone)) return { isValid: false, error: "Telefone inválido (ex: 912345678 ou +351 912345678)" };
  return { isValid: true, hint: "Telefone válido" };
};

export const validateEmailReactive = (email: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!email) return { isValid: false, error: "Email é obrigatório" };
  if (email.length < 5) return { isValid: false, hint: "Email muito curto" };
  if (!/\S+@\S+\.\S+/.test(email)) return { isValid: false, error: "Email inválido" };
  return { isValid: true, hint: "Email válido" };
};

export const validatePostalCodeReactive = (code: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!code) return { isValid: true, hint: "Código postal é opcional" };
  if (!/^\d{4}-\d{3}$/.test(code)) return { isValid: false, error: "Formato deve ser XXXX-XXX" };
  return { isValid: true, hint: "Código postal válido" };
};

export const validateNameReactive = (name: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!name) return { isValid: false, error: "Nome é obrigatório" };
  if (name.length < 2) return { isValid: false, hint: `Faltam ${2 - name.length} caracteres` };
  if (name.length > 100) return { isValid: false, error: "Nome muito longo" };
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return { isValid: false, error: "Nome deve conter apenas letras e espaços" };
  return { isValid: true, hint: "Nome válido" };
};

// Validação de username local (sem verificação no backend por enquanto)
export const validateUsernameLocal = (username: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!username) return { isValid: false, error: "Username é obrigatório" };
  if (username.length < 3) return { isValid: false, hint: `Faltam ${3 - username.length} caracteres` };
  if (username.length > 50) return { isValid: false, error: "Username muito longo" };
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) return { isValid: false, error: "Username só pode conter letras, números, pontos, traços e underscores" };
  
  // Lista de usernames reservados
  const reservedUsernames = ['admin', 'root', 'user', 'test', 'api', 'www', 'mail', 'ftp'];
  if (reservedUsernames.includes(username.toLowerCase())) {
    return { isValid: false, error: "Username reservado, escolha outro" };
  }
  
  return { isValid: true, hint: "Username válido" };
};

// Versão de validação de username com debounce
let usernameCheckTimeout: ReturnType<typeof setTimeout> | null = null;

export const validateUsernameWithDebounce = (username: string): Promise<{ isValid: boolean; error?: string; hint?: string }> => {
  return new Promise((resolve) => {
    // Limpar timeout anterior
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }
    
    // Validações locais primeiro
    if (!username) {
      resolve({ isValid: false, error: "Username é obrigatório" });
      return;
    }
    if (username.length < 3) {
      resolve({ isValid: false, hint: `Faltam ${3 - username.length} caracteres` });
      return;
    }
    if (username.length > 50) {
      resolve({ isValid: false, error: "Username muito longo" });
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      resolve({ isValid: false, error: "Username só pode conter letras, números, pontos, traços e underscores" });
      return;
    }
    
    // Verificação no backend com debounce de 500ms
    usernameCheckTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/check-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.available) {
            resolve({ isValid: true, hint: "Username disponível" });
          } else {
            resolve({ isValid: false, error: "Username já está em uso" });
          }
        } else {
          resolve({ isValid: true, hint: "Username válido (verificação offline)" });
        }        } catch {
          resolve({ isValid: true, hint: "Username válido (verificação offline)" });
        }
    }, 500);
  });
};

// Schema para formulário de registro com validação reativa - EXPANDIDO
export const registerFormSchema = z.object({
  // 👤 DADOS PESSOAIS MÍNIMOS
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido").min(5, "Email muito curto"),
  phone: z.string().regex(phoneRegex, "Telefone inválido"),
  nif: z.string().regex(nifRegex, "NIF deve ter 9 dígitos").refine(validateNIF, "NIF inválido"),
  date_of_birth: z.string().min(1, "Data de nascimento é obrigatória"),
  
  // 🏠 MORADA FISCAL BÁSICA
  fiscal_address: z.string().min(5, "Morada fiscal deve ter pelo menos 5 caracteres").max(200, "Morada muito longa"),
  fiscal_postal_code: z.string().regex(postalCodeRegex, "Código postal inválido (formato: 1234-567)"),
  fiscal_city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").max(50, "Cidade muito longa"),
  
  // 🏢 DADOS EMPRESA MÍNIMOS
  company_name: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  nipc: z.string().regex(nifRegex, "NIPC deve ter 9 dígitos").refine(validateNIPC, "NIPC inválido"),
  cae: z.string().regex(/^\d{5}$/, "CAE deve ter 5 dígitos"),
  legal_form: z.enum(['Lda', 'SA', 'Unipessoal', 'ENI', 'EIRL', 'Outro'], {
    required_error: "Forma jurídica é obrigatória"
  }),
  founding_date: z.string().min(1, "Data de constituição é obrigatória"),
  
  // ⚙️ REGIMES FISCAIS
  accounting_regime: z.enum(['organizada', 'simplificada'], {
    required_error: "Regime de contabilidade é obrigatório"
  }),
  vat_regime: z.enum(['normal', 'isento_art53', 'pequeno_retalhista'], {
    required_error: "Regime de IVA é obrigatório"
  }),
  
  // 📊 OPERACIONAIS BÁSICOS
  business_activity: z.string().min(10, "Descrição da atividade deve ter pelo menos 10 caracteres").max(500, "Descrição muito longa"),
  estimated_revenue: z.coerce.number().min(0, "Faturação estimada deve ser positiva"),
  monthly_invoices: z.coerce.number().min(0, "Número de faturas deve ser positivo"),
  number_employees: z.coerce.number().min(0, "Número de funcionários deve ser positivo").optional(),
  report_frequency: z.enum(['mensal', 'trimestral'], {
    required_error: "Frequência de relatórios é obrigatória"
  }),
  
  // 🔐 DADOS DE ACESSO
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres").max(50, "Username muito longo"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  
  // 📋 CAMPOS OPCIONAIS HERDADOS (manter compatibilidade)
  trade_name: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('Portugal'),
  share_capital: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Validações reativas para os novos campos do registro expandido
export const validateCAEReactive = (cae: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!cae) return { isValid: false, error: "CAE é obrigatório" };
  if (cae.length < 5) return { isValid: false, hint: `Faltam ${5 - cae.length} dígitos` };
  if (cae.length > 5) return { isValid: false, error: "CAE deve ter exatamente 5 dígitos" };
  if (!/^\d{5}$/.test(cae)) return { isValid: false, error: "CAE só pode conter números" };
  return { isValid: true, hint: "CAE válido" };
};

export const validateDateReactive = (date: string, fieldName: string = "Data"): { isValid: boolean; error?: string; hint?: string } => {
  if (!date) return { isValid: false, error: `${fieldName} é obrigatória` };
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return { isValid: false, error: "Data inválida" };
  
  const today = new Date();
  const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  
  if (fieldName === "Data de nascimento") {
    if (dateObj > today) return { isValid: false, error: "Data de nascimento não pode ser no futuro" };
    if (dateObj < hundredYearsAgo) return { isValid: false, error: "Data de nascimento muito antiga" };
    
    const age = today.getFullYear() - dateObj.getFullYear();
    if (age < 18) return { isValid: false, error: "Deve ter pelo menos 18 anos" };
  }
  
  if (fieldName === "Data de constituição") {
    if (dateObj > today) return { isValid: false, error: "Data de constituição não pode ser no futuro" };
    if (dateObj < new Date(1900, 0, 1)) return { isValid: false, error: "Data de constituição muito antiga" };
  }
  
  return { isValid: true, hint: `${fieldName} válida` };
};

export const validateBusinessActivityReactive = (activity: string): { isValid: boolean; error?: string; hint?: string } => {
  if (!activity) return { isValid: false, error: "Descrição da atividade é obrigatória" };
  if (activity.length < 10) return { isValid: false, hint: `Faltam ${10 - activity.length} caracteres (mínimo 10)` };
  if (activity.length > 500) return { isValid: false, error: "Descrição muito longa (máximo 500 caracteres)" };
  return { isValid: true, hint: "Descrição válida" };
};

export const validateNumberReactive = (value: string, fieldName: string, min: number = 0): { isValid: boolean; error?: string; hint?: string } => {
  if (!value) return { isValid: false, error: `${fieldName} é obrigatório` };
  
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, error: `${fieldName} deve ser um número válido` };
  if (num < min) return { isValid: false, error: `${fieldName} deve ser maior ou igual a ${min}` };
  
  return { isValid: true, hint: `${fieldName} válido` };
};

// Generic field validation function for useValidation hook
export const validateField = (
  fieldName: string, 
  value: string, 
  schema: z.ZodSchema<Record<string, unknown>>
): { isValid: boolean; error?: string } => {
  try {
    // Create a partial object with just this field
    const fieldData = { [fieldName]: value };
    
    // Try to validate the whole object (Zod will report errors for individual fields)
    schema.parse(fieldData);
    
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => 
        err.path.length > 0 && err.path[0] === fieldName
      );
      
      return {
        isValid: false,
        error: fieldError?.message || 'Valor inválido'
      };
    }
    
    return {
      isValid: false,
      error: 'Erro de validação'
    };
  }
};
