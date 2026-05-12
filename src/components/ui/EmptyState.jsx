import { FileQuestion } from "lucide-react";

export default function EmptyState({ title = "Sin registros", message = "Aún no hay información para mostrar." }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <FileQuestion className="h-10 w-10 text-slate-300" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}
