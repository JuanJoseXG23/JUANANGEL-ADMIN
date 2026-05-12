import { Save, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { letterVariables, standardLaborLetter } from "../../templates/letterTemplates";
import { getEmployeeVariables, renderTemplate } from "../../utils/templateEngine";

export default function LetterEditor({
  employee,
  templates,
  onGenerate,
  onSaveTemplate,
  onCancel,
  submitting,
}) {
  const [templateName, setTemplateName] = useState(standardLaborLetter.nombrePlantilla);
  const [content, setContent] = useState(standardLaborLetter.contenido);
  const [cargo, setCargo] = useState(employee?.cargo || "");
  const [newTemplateName, setNewTemplateName] = useState("");

  const preview = useMemo(() => {
    return renderTemplate(content, getEmployeeVariables(employee, { cargo }));
  }, [content, employee, cargo]);

  function handleTemplateChange(value) {
    const selected =
      value === standardLaborLetter.nombrePlantilla
        ? standardLaborLetter
        : templates.find((template) => template.id === value);

    if (!selected) return;
    setTemplateName(selected.nombrePlantilla);
    setContent(selected.contenido);
  }

  function appendVariable(variable) {
    setContent((current) => `${current}${current.endsWith(" ") || current.endsWith("\n") ? "" : " "}${variable}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <div>
          <label className="label" htmlFor="template">Plantilla</label>
          <select id="template" className="input mt-1" onChange={(event) => handleTemplateChange(event.target.value)}>
            <option value={standardLaborLetter.nombrePlantilla}>{standardLaborLetter.nombrePlantilla}</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.nombrePlantilla}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="cargoCarta">Cargo en carta</label>
          <input id="cargoCarta" className="input mt-1" value={cargo} onChange={(event) => setCargo(event.target.value)} />
        </div>
      </div>

      <div>
        <p className="label">Variables</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {letterVariables.map((variable) => (
            <button key={variable} type="button" className="rounded border border-slate-300 px-2 py-1 font-mono text-xs text-slate-700 hover:bg-slate-100" onClick={() => appendVariable(variable)}>
              {variable}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label" htmlFor="content">Contenido editable</label>
          <textarea
            id="content"
            className="input mt-1 min-h-[320px] resize-y leading-6"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <div>
          <p className="label">Vista previa</p>
          <div className="mt-1 min-h-[320px] whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800">
            {preview}
          </div>
        </div>
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto]">
        <input
          className="input"
          placeholder="Nombre para guardar como plantilla"
          value={newTemplateName}
          onChange={(event) => setNewTemplateName(event.target.value)}
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onSaveTemplate({ nombrePlantilla: newTemplateName || templateName, contenido: content })}
          disabled={submitting}
        >
          <Save className="h-4 w-4" /> Guardar plantilla
        </button>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button
          type="button"
          className="btn-primary"
          disabled={submitting}
          onClick={() => onGenerate({ tipoDocumento: templateName, contenido: content, cargo })}
        >
          <Wand2 className="h-4 w-4" /> {submitting ? "Generando..." : "Generar PDF"}
        </button>
      </div>
    </div>
  );
}
