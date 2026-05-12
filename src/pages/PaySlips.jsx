import { useState } from "react";
import { Banknote } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import EmployeePicker from "../components/documents/EmployeePicker";
import PaySlipForm from "../components/documents/PaySlipForm";
import { getEmployees } from "../services/employeeService";
import { paySlipExists, registerPaySlip } from "../services/documentService";
import { generatePaySlipPdf } from "../services/pdfService";
import { calculatePaySlip } from "../utils/calculations";
import { useAsync } from "../hooks/useAsync";
import { useAppStore } from "../store/useAppStore";

export default function PaySlips() {
  const employees = useAsync(getEmployees, []);
  const notify = useAppStore((state) => state.notify);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const totals = calculatePaySlip(selectedEmployee, values);
      const duplicated = await paySlipExists({
        empleadoId: selectedEmployee.id,
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

      const result = await generatePaySlipPdf(selectedEmployee, values);
      await registerPaySlip({
        empleadoId: selectedEmployee.id,
        nombreEmpleado: selectedEmployee.nombre,
        cedula: selectedEmployee.cedula,
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
      notify({ title: "Colilla generada", message: "El PDF fue descargado correctamente.", type: "success" });
      setSelectedEmployee(null);
    } catch (err) {
      notify({ title: "No se pudo generar", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Nómina"
        title="Colillas de pago"
        description="Genera colillas con cálculo automático de devengado, deducciones y neto a pagar."
        action={<Banknote className="h-10 w-10 rounded-lg bg-brand-50 p-2 text-brand-700" />}
      />
      {employees.error ? <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{employees.error}</div> : null}
      {employees.loading ? <div className="panel p-6 text-sm text-slate-600">Cargando empleadas...</div> : (
        <EmployeePicker employees={employees.data} onSelect={setSelectedEmployee} actionLabel="Generar colilla" compact />
      )}

      <Modal open={Boolean(selectedEmployee)} title="Generar colilla de pago" onClose={() => setSelectedEmployee(null)}>
        <PaySlipForm
          employee={selectedEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setSelectedEmployee(null)}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}
