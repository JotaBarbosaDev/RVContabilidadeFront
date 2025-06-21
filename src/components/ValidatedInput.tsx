import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  isValid?: boolean;
  isLoading?: boolean;
  hint?: string;
  required?: boolean;
  onValidate?: (value: string) => { isValid: boolean; error?: string; hint?: string } | Promise<{ isValid: boolean; error?: string; hint?: string }>;
}

export function ValidatedInput({
  label,
  name,
  error,
  isValid,
  isLoading,
  hint,
  required,
  onValidate,
  className,
  ...props
}: ValidatedInputProps) {
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [localHint, setLocalHint] = useState<string>();
  const [localIsValid, setLocalIsValid] = useState<boolean>();

  const handleBlur = useCallback(async (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    if (onValidate) {
      const result = await Promise.resolve(onValidate(e.target.value));
      setLocalIsValid(result.isValid);
      setLocalError(result.error);
      setLocalHint(result.hint);
    }
    props.onBlur?.(e);
  }, [onValidate, props]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValidate && isTouched) {
      const result = await Promise.resolve(onValidate(e.target.value));
      setLocalIsValid(result.isValid);
      setLocalError(result.error);
      setLocalHint(result.hint);
    }
    props.onChange?.(e);
  }, [onValidate, isTouched, props]);

  // Usar validação local se disponível, senão usar props
  const finalError = error || localError;
  const finalIsValid = isValid !== undefined ? isValid : localIsValid;
  const finalHint = hint || localHint;

  const showValidation = isTouched && !isLoading;
  const showSuccess = showValidation && finalIsValid && !finalError;
  const showError = showValidation && !finalIsValid && finalError;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "transition-all duration-200",
            showSuccess && "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200",
            showError && "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200",
            "pr-10", // Espaço para o ícone
            className
          )}
        />
        
        {/* Ícone de status */}
        {showValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <AlertCircle className="h-4 w-4 text-gray-400 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : showError ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Mensagens de feedback */}
      {showError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          {finalError}
        </p>
      )}
      
      {showSuccess && finalHint && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {finalHint}
        </p>
      )}
      
      {!showValidation && finalHint && (
        <p className="text-sm text-gray-500">
          {finalHint}
        </p>
      )}
    </div>
  );
}
