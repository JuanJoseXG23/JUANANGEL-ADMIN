import EmptyState from "../ui/EmptyState";

export default function EmployeePicker({ employees, onSelect, actionLabel, compact = false }) {
  if (employees.length === 0) {
    return <EmptyState title="Sin empleadas" message="Primero registra una empleada para generar documentos." />;
  }

  if (compact) {
    return (
      <div className="overflow-x-auto rounded border border-slate-300 bg-white">
        <table className="min-w-[720px] w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100 uppercase text-slate-700">
            <tr>
              <th className="border border-slate-300 px-2 py-2">Nombre</th>
              <th className="border border-slate-300 px-2 py-2">Cedula</th>
              <th className="border border-slate-300 px-2 py-2">Cargo</th>
              <th className="border border-slate-300 px-2 py-2">Estado</th>
              <th className="border border-slate-300 px-2 py-2 text-right">Accion</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-2 py-2 font-semibold">{employee.nombre}</td>
                <td className="border border-slate-300 px-2 py-2">{employee.cedula}</td>
                <td className="border border-slate-300 px-2 py-2">{employee.cargo}</td>
                <td className="border border-slate-300 px-2 py-2">{employee.activo ? "Activa" : "Inactiva"}</td>
                <td className="border border-slate-300 px-2 py-2 text-right">
                  <button type="button" className="text-xs font-bold text-brand-700 underline" onClick={() => onSelect(employee)}>
                    {actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <button
          key={employee.id}
          type="button"
          className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-100 hover:bg-brand-50"
          onClick={() => onSelect(employee)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">{employee.nombre}</p>
              <p className="mt-1 text-sm text-slate-500">CC {employee.cedula}</p>
              <p className="mt-2 text-sm text-slate-700">{employee.cargo}</p>
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${employee.activo ? "bg-emerald-50 text-success" : "bg-slate-100 text-slate-500"}`}>
              {employee.activo ? "Activa" : "Inactiva"}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold text-brand-700">{actionLabel}</p>
        </button>
      ))}
    </div>
  );
}
