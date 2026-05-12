import { useState } from "react";
import { FileText } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import EmployeePicker from "../components/documents/EmployeePicker";
import LetterEditor from "../components/documents/LetterEditor";
import { getEmployees } from "../services/employeeService";
import { registerDocument } from "../services/documentService";
import { generateLaborLetter } from "../services/pdfService";
import { createLetterTemplate, getLetterTemplates } from "../services/templateService";
import { useAsync } from "../hooks/useAsync";
import { useAppStore } from "../store/useAppStore";

export default function Letters() {
  const employees = useAsync(getEmployees, []);
  const templates = useAsync(getLetterTemplates, []);
  const notify = useAppStore((state) => state.notify);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerate(options) {
    setSubmitting(true);
    try {
      const filename = await generateLaborLetter(selectedEmployee, options);
      await registerDocument({
        tipoDocumento: options.tipoDocumento || "Carta laboral",
        empleadaId: selectedEmployee.id,
        empleadaNombre: selectedEmployee.nombre,
        cargoUsado: options.cargo,
        contenido: options.contenido,
        archivo: filename,
      });
      notify({ title: "Carta generada", message: "El PDF fue descargado correctamente.", type: "success" });
      setSelectedEmployee(null);
    } catch (err) {
      notify({ title: "No se pudo generar", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveTemplate(payload) {
    if (!payload.nombrePlantilla?.trim() || !payload.contenido?.trim()) {
      notify({ title: "Plantilla incompleta", message: "Agrega nombre y contenido para guardar.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      await createLetterTemplate(payload);
      await templates.reload();
      notify({ title: "Plantilla guardada", type: "success" });
    } catch (err) {
      notify({ title: "No se pudo guardar", message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Documentos"
        title="Cartas laborales"
        description="Crea cartas personalizadas con plantillas, variables automáticas y edición manual antes de generar el PDF."
        action={<FileText className="h-10 w-10 rounded-lg bg-brand-50 p-2 text-brand-700" />}
      />
      {employees.error ? <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{employees.error}</div> : null}
      {templates.error ? <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{templates.error}</div> : null}
      {employees.loading ? <div className="panel p-6 text-sm text-slate-600">Cargando empleadas...</div> : (
        <EmployeePicker employees={employees.data} onSelect={setSelectedEmployee} actionLabel="Editar y generar carta" />
      )}

      <Modal open={Boolean(selectedEmployee)} title="Editor de carta laboral" onClose={() => setSelectedEmployee(null)}>
        <LetterEditor
          employee={selectedEmployee}
          templates={templates.data}
          onGenerate={handleGenerate}
          onSaveTemplate={handleSaveTemplate}
          onCancel={() => setSelectedEmployee(null)}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}
