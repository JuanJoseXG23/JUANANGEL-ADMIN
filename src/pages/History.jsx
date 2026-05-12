import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { getRecentDocuments, getRecentPaySlips } from "../services/documentService";
import { useAsync } from "../hooks/useAsync";
import { formatDate, formatMoney } from "../utils/formatters";

export default function History() {
  const documents = useAsync(() => getRecentDocuments(25), []);
  const paySlips = useAsync(() => getRecentPaySlips(25), []);

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Auditoría"
        title="Historial"
        description="Registro de documentos generados. Los PDFs no se almacenan; solo queda la trazabilidad."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Cartas laborales</h2>
          <div className="mt-4 space-y-3">
            {documents.error ? <p className="text-sm text-danger">{documents.error}</p> : null}
            {documents.data.length === 0 ? <EmptyState title="Sin cartas" /> : documents.data.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{item.empleadaNombre}</p>
                <p className="text-sm text-slate-500">{item.tipoDocumento} · {formatDate(item.fechaCreacion)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Colillas de pago</h2>
          <div className="mt-4 space-y-3">
            {paySlips.error ? <p className="text-sm text-danger">{paySlips.error}</p> : null}
            {paySlips.data.length === 0 ? <EmptyState title="Sin colillas" /> : paySlips.data.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{item.nombreEmpleado || item.empleadaNombre}</p>
                <p className="text-sm text-slate-500">
                  {item.fechaInicio && item.fechaFin ? `${formatDate(item.fechaInicio, "dd/MM/yyyy")} - ${formatDate(item.fechaFin, "dd/MM/yyyy")}` : item.periodo} · Neto {formatMoney(item.netoPagar)} · {formatDate(item.fechaCreacion)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
