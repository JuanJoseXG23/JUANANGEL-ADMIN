import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeTable from "../components/employees/EmployeeTable";
import PaySlipForm from "../components/documents/PaySlipForm";
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "../services/employeeService";
import { paySlipExists, registerDocument, registerPaySlip } from "../services/documentService";
import { generateLaborLetter, generatePaySlipPdf } from "../services/pdfService";
import { calculatePaySlip } from "../utils/calculations";
import { useAsync } from "../hooks/useAsync";
import { useAppStore } from "../store/useAppStore";

export default function Employees() {
  const { data, loading, error, reload } = useAsync(getEmployees, []);
  const notify = useAppStore((state) => state.notify);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({ type: "", employee: null });
  const [submitting, setSubmitting] = useState(false);

  const filteredEmployees = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return data;
    return data.filter((employee) =>
      [employee.nombre, employee.cedula, employee.cargo].some((value) =>
        String(value || "").toLowerCase().includes(term),
      ),
    );
  }, [data, query]);

  async function handleSave(values) {
    setSubmitting(true);
    try {
      if (modal.employee?.id) {
        await updateEmployee(modal.employee.id, values);
        notify({ title: "Empleada actualizada", type: "success" });
      } else {
        await createEmployee(values);
        notify({ title: "Empleada creada", type: "success" });
      }
      setModal({ type: "", employee: null });
      reload();
    } catch (err) {
      notify({ title: "No se pudo guardar", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(employee) {
    if (!confirm(`¿Eliminar a ${employee.nombre}?`)) return;
    try {
      await deleteEmployee(employee.id);
      notify({ title: "Empleada eliminada", type: "success" });
      reload();
    } catch (err) {
      notify({ title: "No se pudo eliminar", message: err.message, type: "error" });
    }
  }

  async function handleLetter(employee) {
    setSubmitting(true);
    try {
      const filename = await generateLaborLetter(employee);
      await registerDocument({
        tipoDocumento: "Carta laboral",
        empleadaId: employee.id,
        empleadaNombre: employee.nombre,
        archivo: filename,
      });
      notify({ title: "Carta generada", message: "El PDF fue descargado y el historial quedó registrado.", type: "success" });
    } catch (err) {
      notify({ title: "No se pudo generar la carta", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaySlip(values) {
    setSubmitting(true);
    try {
      const { employee } = modal;
      const totals = calculatePaySlip(employee, values);
      const duplicated = await paySlipExists({
        empleadoId: employee.id,
        ano: totals.ano,
        mes: totals.mesNumero,
        quincena: totals.quincena,
      });

      if (duplicated) {
        notify({
          title: "Colilla duplicada",
          message: "Ya existe una colilla para esta empleada, mes y quincena.",
          type: "error",
        });
        return;
      }

      const result = await generatePaySlipPdf(employee, values);
      await registerPaySlip({
        empleadoId: employee.id,
        nombreEmpleado: employee.nombre,
        cedula: employee.cedula,
        ano: result.totals.ano,
        mes: result.totals.mesNumero,
        fechaInicio: result.totals.fechaInicio,
        fechaFin: result.totals.fechaFin,
        quincena: result.totals.quincena,
        salarioBase: result.totals.salarioBase,
        auxilioTransporte: result.totals.auxilioTransporte,
        eps: result.totals.eps,
        pension: result.totals.pension,
        otrasDeducciones: result.totals.otrasDeducciones,
        deducciones: result.totals.deducciones,
        totalDevengado: result.totals.totalDevengado,
        netoPagar: result.totals.netoPagar,
        archivo: result.filename,
      });
      setModal({ type: "", employee: null });
      notify({ title: "Colilla generada", message: "El PDF fue descargado y el historial quedó registrado.", type: "success" });
    } catch (err) {
      notify({ title: "No se pudo generar la colilla", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Talento humano"
        title="Empleadas"
        description="Administra la información base y genera documentos desde cada registro."
        action={
          <button className="btn-primary" type="button" onClick={() => setModal({ type: "employee", employee: null })}>
            <Plus className="h-4 w-4" /> Nueva empleada
          </button>
        }
      />

      {error ? <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div> : null}
      {loading ? <div className="panel p-6 text-sm text-slate-600">Cargando empleadas...</div> : (
        <EmployeeTable
          employees={filteredEmployees}
          query={query}
          onQueryChange={setQuery}
          onEdit={(employee) => setModal({ type: "employee", employee })}
          onDelete={handleDelete}
          onLetter={handleLetter}
          onPaySlip={(employee) => setModal({ type: "payslip", employee })}
        />
      )}

      <Modal
        open={modal.type === "employee"}
        title={modal.employee ? "Editar empleada" : "Nueva empleada"}
        onClose={() => setModal({ type: "", employee: null })}
      >
        <EmployeeForm
          initialData={modal.employee}
          onSubmit={handleSave}
          onCancel={() => setModal({ type: "", employee: null })}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={modal.type === "payslip"}
        title="Generar colilla de pago"
        onClose={() => setModal({ type: "", employee: null })}
      >
        <PaySlipForm
          employee={modal.employee}
          onSubmit={handlePaySlip}
          onCancel={() => setModal({ type: "", employee: null })}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}
