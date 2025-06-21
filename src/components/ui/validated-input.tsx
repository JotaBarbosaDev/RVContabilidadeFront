import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  isValid?: boolean;
  isValidating?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  helpText?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  isValidating = false,
  required = false,
  type = 'text',
  placeholder,
  maxLength,
  className,
  disabled = false,
  helpText,
}) => {
  const hasValue = value && value.length > 0;
  const showValidation = hasValue && !isValidating;
  const showSuccess = showValidation && isValid && !error;
  const showError = showValidation && (!isValid || error);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            'pr-10 transition-all duration-200',
            showSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500',
            showError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        
        {/* Ícone de status */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isValidating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          )}
          {showSuccess && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {showError && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {showError && error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Texto de ajuda */}
      {helpText && !showError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {/* Contador de caracteres */}
      {maxLength && hasValue && (
        <div className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

// Componente para campos de seleção
interface ValidatedSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  isValid?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  helpText?: string;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  isValid,
  required = false,
  placeholder = 'Selecione uma opção',
  className,
  disabled = false,
  helpText,
}) => {
  const hasValue = value && value.length > 0;
  const showValidation = hasValue;
  const showSuccess = showValidation && isValid && !error;
  const showError = showValidation && (!isValid || error);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'pr-10 transition-all duration-200',
            showSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500',
            showError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Ícone de status */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-8">
          {showSuccess && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {showError && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {showError && error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Texto de ajuda */}
      {helpText && !showError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};
