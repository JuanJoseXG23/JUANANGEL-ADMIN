import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export default function ToastHost() {
  const { toasts, removeToast } = useAppStore();

  useEffect(() => {
    const timers = toasts.map((toast) => setTimeout(() => removeToast(toast.id), 4200));
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div key={toast.id} className="panel flex items-start gap-3 p-4">
            <Icon className="mt-0.5 h-5 w-5 text-brand-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.message ? <p className="mt-1 text-sm text-slate-600">{toast.message}</p> : null}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
