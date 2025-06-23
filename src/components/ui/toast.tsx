import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(({ title, description, type = "info", onClose, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 150); // Allow fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-4 right-4 z-50 w-80 p-4 border rounded-lg shadow-lg transition-all duration-150 ease-in-out",
        getTypeStyles(),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 150);
          }}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

Toast.displayName = "Toast";

export { Toast };

// Toast container and hook
interface ToastState {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}

const ToastContext = React.createContext<{
  toasts: ToastState[];
  addToast: (toast: Omit<ToastState, "id">) => void;
  removeToast: (id: string) => void;
} | null>(null);

export { ToastContext };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastState, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
