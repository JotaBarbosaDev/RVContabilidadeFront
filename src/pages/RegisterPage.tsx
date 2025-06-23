import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, FileText, User, Building, Check, Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type StepType = 'identification' | 'existing-client' | 'new-client-type' | 'general-data' | 'accounting-info' | 'current-situation' | 'confirmation';
type ClientType = 'existing' | 'new' | null;
type BusinessType = 'individual' | 'sole-trader' | 'company' | 'other' | null;

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<StepType>('identification');
  const [clientType, setClientType] = useState<ClientType>(null);
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados gerais
    nif: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    dateOfBirth: '', // Campo obrigatório adicionado
    
    // Morada fiscal (se diferente da principal)
    fiscalAddress: '',
    fiscalPostalCode: '',
    fiscalCity: '',
    
    // Cliente existente
    accessType: '',
    
    // Novo cliente
    businessTypeOther: '',
    estimatedRevenue: '',
    monthlyDocuments: '',
    documentDelivery: '',
    invoicingTool: '',
    accountingRegime: 'organizada', // Valor padrão
    vatRegime: 'isento_art53', // Campo obrigatório adicionado
    businessActivity: '', // Campo obrigatório adicionado
    foundingDate: '', // Campo obrigatório adicionado
    reportFrequency: 'trimestral', // Campo obrigatório adicionado
    
    // Situação atual
    hasActivity: '',
    hasSocialSecurity: '',
    hasEmployees: '',
    hasDebts: '',
    observations: '',
    
    // Documentos
    documents: [] as File[],
    
    // Confirmações
    termsAccepted: false,
    dataProcessingAccepted: false
  });

  const steps = [
    { id: 'identification', title: 'Identificação', icon: User },
    { id: 'existing-client', title: 'Cliente Existente', icon: FileText, condition: clientType === 'existing' },
    { id: 'new-client-type', title: 'Tipo de Cliente', icon: Building, condition: clientType === 'new' },
    { id: 'general-data', title: 'Dados Gerais', icon: FileText, condition: clientType === 'new' },
    { id: 'accounting-info', title: 'Info Contabilística', icon: Calculator, condition: clientType === 'new' },
    { id: 'current-situation', title: 'Situação Atual', icon: Check, condition: clientType === 'new' },
    { id: 'confirmation', title: 'Confirmação', icon: Check }
  ].filter(step => step.condition !== false);

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const isLastStep = () => getCurrentStepIndex() === steps.length - 1;
  const isFirstStep = () => getCurrentStepIndex() === 0;

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as StepType);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as StepType);
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
    <div className="flex items-center justify-center space-x-2 mb-8">
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
  );

  const renderIdentificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Como podemos ajudar?</h3>
        <p className="text-muted-foreground">Selecione a opção que melhor descreve a sua situação</p>
      </div>
      
      <div className="space-y-4">
        <div 
          className={`
            p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-accounting-primary/50
            ${clientType === 'existing' ? 'border-accounting-primary bg-accounting-primary/5' : 'border-border'}
          `}
          onClick={() => setClientType('existing')}
        >
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full border-2 border-accounting-primary flex items-center justify-center mt-0.5">
              {clientType === 'existing' && <div className="w-3 h-3 bg-accounting-primary rounded-full" />}
            </div>
            <div>
              <h4 className="font-medium">Já sou cliente e quero ativar acesso online</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Já é cliente da RV Contabilidade e pretende aceder à plataforma digital
              </p>
            </div>
          </div>
        </div>

        <div 
          className={`
            p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-accounting-primary/50
            ${clientType === 'new' ? 'border-accounting-primary bg-accounting-primary/5' : 'border-border'}
          `}
          onClick={() => setClientType('new')}
        >
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full border-2 border-accounting-primary flex items-center justify-center mt-0.5">
              {clientType === 'new' && <div className="w-3 h-3 bg-accounting-primary rounded-full" />}
            </div>
            <div>
              <h4 className="font-medium">Quero ser cliente (pedido de adesão)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ainda não é cliente e pretende solicitar adesão aos nossos serviços
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExistingClientStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Identificação do Cliente</h3>
        <p className="text-muted-foreground">Confirme os seus dados para ativarmos o acesso</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nif">NIF (pessoa singular ou coletiva)</Label>
          <Input
            id="nif"
            type="text"
            placeholder="123456789"
            value={formData.nif}
            onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome completo / Nome da empresa</Label>
          <Input
            id="name"
            type="text"
            placeholder="João Silva / Empresa Lda"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de contacto</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telemóvel</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="912 345 678"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessType">Deseja associar este acesso a:</Label>
          <select
            id="accessType"
            value={formData.accessType}
            onChange={(e) => setFormData(prev => ({ ...prev, accessType: e.target.value }))}
            className="w-full h-11 px-3 border border-input bg-background rounded-md text-sm"
          >
            <option value="">Selecione uma opção</option>
            <option value="contabilidade">Contabilidade</option>
            <option value="salarios">Processamento de salários</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Documento de confirmação de identidade (opcional)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Clique para anexar documento ou arraste aqui
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
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

  const renderNewClientTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Tipo de Cliente</h3>
        <p className="text-muted-foreground">Selecione o tipo que melhor descreve a sua situação</p>
      </div>

      <div className="space-y-4">
        {[
          { value: 'individual', label: 'Pessoa singular com atividade aberta', desc: 'Trabalhador independente, freelancer' },
          { value: 'sole-trader', label: 'Empresário em nome individual', desc: 'ENI com contabilidade organizada' },
          { value: 'company', label: 'Sociedade por quotas / unipessoal', desc: 'Empresa constituída (Lda, SA, etc.)' },
          { value: 'other', label: 'Outro', desc: 'Outra situação específica' }
        ].map((type) => (
          <div 
            key={type.value}
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-accounting-primary/50
              ${businessType === type.value ? 'border-accounting-primary bg-accounting-primary/5' : 'border-border'}
            `}
            onClick={() => setBusinessType(type.value as BusinessType)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full border-2 border-accounting-primary flex items-center justify-center mt-0.5">
                {businessType === type.value && <div className="w-3 h-3 bg-accounting-primary rounded-full" />}
              </div>
              <div>
                <h4 className="font-medium">{type.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{type.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {businessType === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="businessTypeOther">Descrição da situação</Label>
          <Input
            id="businessTypeOther"
            type="text"
            placeholder="Descreva a sua situação específica"
            value={formData.businessTypeOther}
            onChange={(e) => setFormData(prev => ({ ...prev, businessTypeOther: e.target.value }))}
            className="h-11"
          />
        </div>
      )}
    </div>
  );

  const renderGeneralDataStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Dados Gerais</h3>
        <p className="text-muted-foreground">Preencha as informações básicas</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo / Nome da empresa *</Label>
          <Input
            id="name"
            type="text"
            placeholder="João Silva / Empresa Lda"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nif">NIF *</Label>
          <Input
            id="nif"
            type="text"
            placeholder="123456789"
            value={formData.nif}
            onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email de contacto *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telemóvel *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="912 345 678"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Morada fiscal *</Label>
          <Input
            id="address"
            type="text"
            placeholder="Rua das Flores, 123"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código postal *</Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="1000-001"
              value={formData.postalCode}
              onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Localidade *</Label>
            <Input
              id="city"
              type="text"
              placeholder="Lisboa"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Documentos</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Certidão permanente (PDF) e BI/CC do responsável legal
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-general"
              />
              <label htmlFor="file-upload-general">
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

  const renderAccountingInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Informação Contabilística</h3>
        <p className="text-muted-foreground">Detalhes sobre a sua atividade contabilística</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Regime de contabilidade:</Label>
          {[
            { value: 'organizada', label: 'Contabilidade organizada' },
            { value: 'simplificado', label: 'Regime simplificado' },
            { value: 'so-atividade', label: 'Só atividade aberta sem contabilidade' }
          ].map((regime) => (
            <div key={regime.value} className="flex items-center space-x-3">
              <div 
                className={`
                  w-5 h-5 rounded-full border-2 border-accounting-primary flex items-center justify-center cursor-pointer
                  ${formData.accountingRegime === regime.value ? 'bg-accounting-primary' : ''}
                `}
                onClick={() => setFormData(prev => ({ ...prev, accountingRegime: regime.value }))}
              >
                {formData.accountingRegime === regime.value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <label className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, accountingRegime: regime.value }))}>
                {regime.label}
              </label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedRevenue">Volume de faturação anual estimado (€)</Label>
            <Input
              id="estimatedRevenue"
              type="number"
              placeholder="50000"
              value={formData.estimatedRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedRevenue: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyDocuments">Nº médio de documentos/mês</Label>
            <Input
              id="monthlyDocuments"
              type="number"
              placeholder="50"
              value={formData.monthlyDocuments}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyDocuments: e.target.value }))}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Envio de documentos:</Label>
          {[
            { value: 'digital', label: 'Digital (PDFs, scanner, app)' },
            { value: 'papel', label: 'Papel físico (via correio)' },
            { value: 'misto', label: 'Misto' }
          ].map((delivery) => (
            <div key={delivery.value} className="flex items-center space-x-3">
              <div 
                className={`
                  w-5 h-5 rounded-full border-2 border-accounting-primary flex items-center justify-center cursor-pointer
                  ${formData.documentDelivery === delivery.value ? 'bg-accounting-primary' : ''}
                `}
                onClick={() => setFormData(prev => ({ ...prev, documentDelivery: delivery.value }))}
              >
                {formData.documentDelivery === delivery.value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <label className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, documentDelivery: delivery.value }))}>
                {delivery.label}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoicingTool">Ferramenta de faturação utilizada</Label>
          <select
            id="invoicingTool"
            value={formData.invoicingTool}
            onChange={(e) => setFormData(prev => ({ ...prev, invoicingTool: e.target.value }))}
            className="w-full h-11 px-3 border border-input bg-background rounded-md text-sm"
          >
            <option value="">Selecione uma opção</option>
            <option value="moloni">Moloni</option>
            <option value="invoicexpress">InvoiceXpress</option>
            <option value="toconline">TOConline</option>
            <option value="outro">Outro</option>
            <option value="nenhum">Nenhum</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCurrentSituationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Situação Atual</h3>
        <p className="text-muted-foreground">Informações sobre a sua situação fiscal e laboral</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'hasActivity', label: 'Tem atividade aberta nas Finanças?' },
          { key: 'hasSocialSecurity', label: 'Tem número de segurança social?' },
          { key: 'hasEmployees', label: 'Tem trabalhadores dependentes?' },
          { key: 'hasDebts', label: 'Tem dívidas fiscais ou à SS conhecidas?' }
        ].map((question) => (
          <div key={question.key} className="space-y-3">
            <Label className="text-base font-medium">{question.label}</Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <div 
                  className={`
                    w-5 h-5 rounded-full border-2 border-accounting-primary flex items-center justify-center cursor-pointer
                    ${formData[question.key as keyof typeof formData] === 'sim' ? 'bg-accounting-primary' : ''}
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, [question.key]: 'sim' }))}
                >
                  {formData[question.key as keyof typeof formData] === 'sim' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <label className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, [question.key]: 'sim' }))}>
                  Sim
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className={`
                    w-5 h-5 rounded-full border-2 border-accounting-primary flex items-center justify-center cursor-pointer
                    ${formData[question.key as keyof typeof formData] === 'nao' ? 'bg-accounting-primary' : ''}
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, [question.key]: 'nao' }))}
                >
                  {formData[question.key as keyof typeof formData] === 'nao' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <label className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, [question.key]: 'nao' }))}>
                  Não
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="observations">Observações adicionais</Label>
          <textarea
            id="observations"
            placeholder="Ex: mudou de TOC, teve problemas anteriores, etc."
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-vertical"
          />
          <p className="text-xs text-muted-foreground">
            Partilhe qualquer informação adicional que possa ser relevante
          </p>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Finalização e Confirmação</h3>
        <p className="text-muted-foreground">Revise os dados e confirme o pedido</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-3">Resumo do Pedido</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <Badge variant="secondary">
              {clientType === 'existing' ? 'Cliente Existente' : 'Novo Cliente'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span>{formData.name || 'Não informado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">NIF:</span>
            <span>{formData.nif || 'Não informado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{formData.email || 'Não informado'}</span>
          </div>
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
          <div 
            className={`
              w-5 h-5 rounded border-2 border-accounting-primary flex items-center justify-center cursor-pointer mt-0.5
              ${formData.termsAccepted ? 'bg-accounting-primary' : ''}
            `}
            onClick={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
          >
            {formData.termsAccepted && <Check className="h-3 w-3 text-white" />}
          </div>
          <label className="text-sm cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}>
            Li e aceito os{" "}
            <button className="text-accounting-primary hover:underline">
              Termos e Condições
            </button>
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <div 
            className={`
              w-5 h-5 rounded border-2 border-accounting-primary flex items-center justify-center cursor-pointer mt-0.5
              ${formData.dataProcessingAccepted ? 'bg-accounting-primary' : ''}
            `}
            onClick={() => setFormData(prev => ({ ...prev, dataProcessingAccepted: !prev.dataProcessingAccepted }))}
          >
            {formData.dataProcessingAccepted && <Check className="h-3 w-3 text-white" />}
          </div>
          <label className="text-sm cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, dataProcessingAccepted: !prev.dataProcessingAccepted }))}>
            Autorizo o tratamento dos dados pessoais para efeitos de onboarding conforme a{" "}
            <button className="text-accounting-primary hover:underline">
              Política de Privacidade
            </button>
          </label>
        </div>
      </div>

      {clientType === 'existing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Próximos passos:</strong> Iremos validar os seus dados com a nossa base de dados 
            e enviar uma notificação sobre o estado do pedido nas próximas 24 horas.
          </p>
        </div>
      )}

      {clientType === 'new' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Próximos passos:</strong> A nossa equipa irá analisar o seu pedido de adesão 
            e entrar em contacto consigo para agendar uma consulta inicial.
          </p>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'identification':
        return renderIdentificationStep();
      case 'existing-client':
        return renderExistingClientStep();
      case 'new-client-type':
        return renderNewClientTypeStep();
      case 'general-data':
        return renderGeneralDataStep();
      case 'accounting-info':
        return renderAccountingInfoStep();
      case 'current-situation':
        return renderCurrentSituationStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return renderIdentificationStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'identification':
        return clientType !== null;
      case 'existing-client':
        return formData.nif && formData.name && formData.email && formData.phone && formData.accessType;
      case 'new-client-type':
        return businessType !== null && (businessType !== 'other' || formData.businessTypeOther);
      case 'general-data':
        return formData.name && formData.nif && formData.email && formData.phone && formData.address && formData.postalCode && formData.city;
      case 'accounting-info':
        return true; // Optional step
      case 'current-situation':
        return true; // Optional step
      case 'confirmation':
        return formData.termsAccepted && formData.dataProcessingAccepted;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!clientType) return;
    
    // Validação básica
    if (!formData.name || !formData.nif || !formData.email || !formData.phone) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validação específica para cliente existente
    if (clientType === 'existing' && !formData.accessType) {
      setSubmitError('Por favor, selecione o tipo de acesso desejado');
      return;
    }

    // Validação específica para novo cliente
    if (clientType === 'new' && (!businessType || !formData.address || !formData.city)) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const registerData = {
        type: clientType === 'existing' ? 'existing-client' as const : 'new-client' as const,
        name: formData.name,
        nif: formData.nif,
        email: formData.email,
        phone: formData.phone,
        businessType: businessType || undefined,
        businessTypeOther: formData.businessTypeOther,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        dateOfBirth: formData.dateOfBirth,
        fiscalAddress: formData.fiscalAddress || formData.address, // Usar endereço principal se não especificado
        fiscalPostalCode: formData.fiscalPostalCode || formData.postalCode,
        fiscalCity: formData.fiscalCity || formData.city,
        accessType: formData.accessType,
        accountingRegime: formData.accountingRegime,
        vatRegime: formData.vatRegime,
        businessActivity: formData.businessActivity,
        foundingDate: formData.foundingDate,
        reportFrequency: formData.reportFrequency,
        estimatedRevenue: formData.estimatedRevenue,
        monthlyDocuments: formData.monthlyDocuments,
        documentDelivery: formData.documentDelivery,
        invoicingTool: formData.invoicingTool,
        hasActivity: formData.hasActivity,
        hasSocialSecurity: formData.hasSocialSecurity,
        hasEmployees: formData.hasEmployees,
        hasDebts: formData.hasDebts,
        observations: formData.observations,
        documents: formData.documents
      };

      console.log('Form data being submitted:', registerData);
      console.log('Client type:', clientType);
      console.log('Business type:', businessType);

      const result = await register(registerData);
      setSubmitSuccess(result.message);
      
      // Redirect após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erro ao enviar solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accounting-surface/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Back to login */}
        <Link 
          to="/login" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao login
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-accounting-primary rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Registo de Cliente
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {clientType === 'existing' 
                ? 'Solicite acesso à plataforma digital' 
                : clientType === 'new'
                ? 'Pedido de adesão aos serviços RV Contabilidade'
                : 'Como pretende prosseguir?'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {renderStepIndicator()}
            
            <div className="min-h-[400px]">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Solicitação Enviada!</h3>
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
                  <h3 className="text-xl font-semibold mb-2 text-red-800">Erro ao Enviar</h3>
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
                  isSubmitting ? 'A enviar...' : (
                    clientType === 'existing' ? 'Pedir Acesso' : 'Enviar Pedido'
                  )
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
