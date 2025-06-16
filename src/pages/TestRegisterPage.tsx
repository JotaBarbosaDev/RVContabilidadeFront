import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestRegisterPage() {
  const [formData, setFormData] = useState<{
    type: 'existing-client' | 'new-client';
    name: string;
    nif: string;
    email: string;
    phone: string;
    accessType: string;
  }>({
    type: 'existing-client',
    name: 'João Silva',
    nif: '123456789',
    email: 'joao@teste.com',
    phone: '912345678',
    accessType: 'contabilidade'
  });
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setResponse('');

    try {
      console.log('Sending test data:', formData);

      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      const responseText = await res.text();
      console.log('Raw response:', responseText);

      if (!res.ok) {
        setResponse(`Error ${res.status}: ${responseText}`);
      } else {
        setResponse(`Success: ${responseText}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setResponse(`Network Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accounting-surface/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Teste de Registro - Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'existing-client' | 'new-client' }))}
                className="w-full h-10 px-3 border rounded"
              >
                <option value="existing-client">Cliente Existente</option>
                <option value="new-client">Novo Cliente</option>
              </select>
            </div>
            <div>
              <Label>Nome</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>NIF</Label>
              <Input 
                value={formData.nif} 
                onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value }))}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={formData.email} 
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label>Tipo de Acesso</Label>
              <select 
                value={formData.accessType} 
                onChange={(e) => setFormData(prev => ({ ...prev, accessType: e.target.value }))}
                className="w-full h-10 px-3 border rounded"
              >
                <option value="contabilidade">Contabilidade</option>
                <option value="salarios">Salários</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
          </div>

          <Button onClick={handleTest} disabled={isLoading} className="w-full">
            {isLoading ? 'Testando...' : 'Testar Registro'}
          </Button>

          {response && (
            <div className="mt-4 p-4 border rounded bg-muted">
              <h3 className="font-medium mb-2">Resposta:</h3>
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          )}

          <div className="mt-4 p-4 border rounded bg-muted">
            <h3 className="font-medium mb-2">Dados que serão enviados:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
