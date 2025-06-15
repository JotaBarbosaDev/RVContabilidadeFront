import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';

export const TokenExpiryNotification: React.FC = () => {
  const { isAuthenticated, isTokenValid, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (!tokenExpiry) return;

      const now = new Date().getTime();
      const expiryTime = parseInt(tokenExpiry);
      const timeDiff = expiryTime - now;

      // Mostrar aviso quando faltam 24 horas (1 dia)
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeDiff > 0 && timeDiff <= oneDayInMs) {
        setShowWarning(true);
        
        // Calcular tempo restante
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        setShowWarning(false);
      }
    };

    // Verificar imediatamente
    checkTokenExpiry();

    // Verificar a cada minuto
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!showWarning || !isAuthenticated || !isTokenValid()) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-80 z-50 bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-800">Sessão a expirar</h4>
          <p className="text-sm text-amber-700 mt-1">
            Sua sessão expira em {timeLeft}. Faça login novamente para continuar.
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="h-7 px-3 text-xs border-amber-300 hover:bg-amber-100"
            >
              Dispensar
            </Button>
            <Button
              size="sm"
              onClick={() => logout(false)} // Logout local para forçar relogin
              className="h-7 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white"
            >
              Renovar Sessão
            </Button>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowWarning(false)}
          className="h-6 w-6 p-0 border-amber-300 hover:bg-amber-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default TokenExpiryNotification;
