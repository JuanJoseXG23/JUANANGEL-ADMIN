import { Banknote, FileText, Plus, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { getEmployees } from "../services/employeeService";
import { getRecentDocuments, getRecentPaySlips } from "../services/documentService";
import { useAsync } from "../hooks/useAsync";
import { formatDate, formatMoney } from "../utils/formatters";

function StatCard({ icon: Icon, label, value, tone = "text-brand-700" }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <Icon className={`h-6 w-6 ${tone}`} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const employees = useAsync(getEmployees, []);
  const documents = useAsync(() => getRecentDocuments(5), []);
  const paySlips = useAsync(() => getRecentPaySlips(5), []);

  const activeEmployees = employees.data.filter((employee) => employee.activo).length;

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Control interno"
        title="Dashboard"
        description="Resumen operativo de empleadas, cartas laborales y colillas generadas."
        action={
          <>
            <Link className="btn-secondary" to="/empleadas">
              <UsersRound className="h-4 w-4" /> Empleadas
            </Link>
            <Link className="btn-primary" to="/empleadas">
              <Plus className="h-4 w-4" /> Nueva empleada
            </Link>
          </>
        }
      />

      {employees.error ? (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{employees.error}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Total empleadas" value={employees.loading ? "..." : employees.data.length} />
        <StatCard icon={UsersRound} label="Activas" value={employees.loading ? "..." : activeEmployees} tone="text-success" />
        <StatCard icon={FileText} label="Últimas cartas" value={documents.loading ? "..." : documents.data.length} />
        <StatCard icon={Banknote} label="Últimas colillas" value={paySlips.loading ? "..." : paySlips.data.length} tone="text-slate-700" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Últimas cartas generadas</h2>
          <div className="mt-4 space-y-3">
            {documents.data.length === 0 ? (
              <EmptyState title="Sin cartas" message="Genera una carta laboral desde el módulo de empleadas." />
            ) : (
              documents.data.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{item.empleadaNombre}</p>
                  <p className="text-sm text-slate-500">{item.tipoDocumento} · {formatDate(item.fechaCreacion)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Últimas colillas generadas</h2>
          <div className="mt-4 space-y-3">
            {paySlips.data.length === 0 ? (
              <EmptyState title="Sin colillas" message="Genera una colilla desde el módulo de empleadas o colillas." />
            ) : (
              paySlips.data.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{item.nombreEmpleado || item.empleadaNombre}</p>
                  <p className="text-sm text-slate-500">
                    {item.fechaInicio && item.fechaFin ? `${formatDate(item.fechaInicio, "dd/MM/yyyy")} - ${formatDate(item.fechaFin, "dd/MM/yyyy")}` : item.periodo} · Neto {formatMoney(item.netoPagar)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
