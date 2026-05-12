import { Edit3, FileText, Search, Trash2, WalletCards } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { formatDate, formatMoney } from "../../utils/formatters";

export default function EmployeeTable({
  employees,
  query,
  onQueryChange,
  onEdit,
  onDelete,
  onLetter,
  onPaySlip,
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, cédula o cargo"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>
      {employees.length === 0 ? (
        <div className="p-4">
          <EmptyState title="No hay empleadas" message="Crea la primera empleada para generar cartas y colillas." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Empleada</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Ingreso</th>
                <th className="px-4 py-3">Salario</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{employee.nombre}</p>
                    <p className="text-xs text-slate-500">CC {employee.cedula} de {employee.expedicion}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{employee.cargo}</td>
                  <td className="px-4 py-4 text-slate-700">{formatDate(employee.fechaIngreso)}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatMoney(employee.salario)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${employee.activo ? "bg-emerald-50 text-success" : "bg-slate-100 text-slate-500"}`}>
                      {employee.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary px-3" type="button" onClick={() => onLetter(employee)} title="Generar carta">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="btn-secondary px-3" type="button" onClick={() => onPaySlip(employee)} title="Generar colilla">
                        <WalletCards className="h-4 w-4" />
                      </button>
                      <button className="btn-secondary px-3" type="button" onClick={() => onEdit(employee)} title="Editar">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="btn-danger px-3" type="button" onClick={() => onDelete(employee)} title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
