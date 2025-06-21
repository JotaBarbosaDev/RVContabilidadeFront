import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { validateField } from '@/lib/validations';

interface UseValidationOptions {
  sc    return Object.keys(fields).reduce((acc, key) => {
      (acc as Record<string, unknown>)[key] = fields[key as keyof T].value;
      return acc;
    }, {} as T);: z.ZodSchema;
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FieldState {
  value: string;
  error?: string;
  isValid: boolean;
  isValidating: boolean;
  isTouched: boolean;
}

export const useValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  options: UseValidationOptions
) => {
  const { schema, debounceMs = 300, validateOnChange = true, validateOnBlur = true } = options;
  
  // Estado dos campos
  const [fields, setFields] = useState<Record<keyof T, FieldState>>(() => {
    const initialState = {} as Record<keyof T, FieldState>;
    
    Object.keys(initialValues).forEach((key) => {
      initialState[key as keyof T] = {
        value: initialValues[key] as string || '',
        isValid: false,
        isValidating: false,
        isTouched: false,
      };
    });
    
    return initialState;
  });
  
  // Timers para debounce
  const [debounceTimers, setDebounceTimers] = useState<Record<string, number>>({});
  
  // Limpar timers ao desmontar
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(clearTimeout);
    };
  }, [debounceTimers]);
  
  // Validar um campo específico
  const validateFieldAsync = useCallback((fieldName: keyof T, value: string) => {
    const validation = validateField(fieldName as string, value, schema);
    
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error: validation.error,
        isValid: validation.isValid,
        isValidating: false,
      }
    }));
  }, [schema]);
  
  // Atualizar valor de um campo
  const setValue = useCallback((fieldName: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        isTouched: true,
      }
    }));
    
    if (validateOnChange) {
      // Limpar timer anterior se existir
      if (debounceTimers[fieldName as string]) {
        clearTimeout(debounceTimers[fieldName as string]);
      }
      
      // Marcar como validando
      setFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          isValidating: true,
        }
      }));
      
      // Configurar novo timer
      const timer = setTimeout(() => {
        validateFieldAsync(fieldName, value);
        setDebounceTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[fieldName as string];
          return newTimers;
        });
      }, debounceMs);
      
      setDebounceTimers(prev => ({
        ...prev,
        [fieldName as string]: timer,
      }));
    }
  }, [validateOnChange, debounceMs, validateFieldAsync, debounceTimers]);
  
  // Validar no blur
  const handleBlur = useCallback((fieldName: keyof T) => {
    if (validateOnBlur) {
      const currentValue = fields[fieldName].value;
      
      // Cancelar debounce se estiver rodando
      if (debounceTimers[fieldName as string]) {
        clearTimeout(debounceTimers[fieldName as string]);
        setDebounceTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[fieldName as string];
          return newTimers;
        });
      }
      
      // Validar imediatamente
      validateFieldAsync(fieldName, currentValue);
    }
  }, [validateOnBlur, fields, validateFieldAsync, debounceTimers]);
  
  // Validar todos os campos
  const validateAll = useCallback((): boolean => {
    const values = Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key as keyof T].value;
      return acc;
    }, {} as any);
    
    try {
      schema.parse(values);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newFields = { ...fields };
        
        // Limpar erros anteriores
        Object.keys(newFields).forEach(key => {
          newFields[key as keyof T] = {
            ...newFields[key as keyof T],
            error: undefined,
            isValid: true,
          };
        });
        
        // Aplicar novos erros
        error.errors.forEach(err => {
          const fieldName = err.path[0] as keyof T;
          if (newFields[fieldName]) {
            newFields[fieldName] = {
              ...newFields[fieldName],
              error: err.message,
              isValid: false,
            };
          }
        });
        
        setFields(newFields);
      }
      return false;
    }
  }, [fields, schema]);
  
  // Obter valores atuais
  const getValues = useCallback((): T => {
    return Object.keys(fields).reduce((acc, key) => {
      acc[key as keyof T] = fields[key as keyof T].value as T[keyof T];
      return acc;
    }, {} as T);
  }, [fields]);
  
  // Resetar formulário
  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = { ...initialValues, ...newValues };
    
    setFields(() => {
      const resetState: Record<keyof T, FieldState> = {} as any;
      
      Object.keys(resetValues).forEach((key) => {
        resetState[key as keyof T] = {
          value: resetValues[key] || '',
          isValid: false,
          isValidating: false,
          isTouched: false,
        };
      });
      
      return resetState;
    });
    
    // Limpar todos os timers
    Object.values(debounceTimers).forEach(clearTimeout);
    setDebounceTimers({});
  }, [initialValues, debounceTimers]);
  
  // Verificar se o formulário é válido
  const isFormValid = Object.values(fields).every(field => field.isValid && !field.error);
  
  // Verificar se há campos sendo validados
  const isValidating = Object.values(fields).some(field => field.isValidating);
  
  return {
    fields,
    setValue,
    handleBlur,
    validateAll,
    getValues,
    reset,
    isFormValid,
    isValidating,
  };
};
