import { useEffect } from "react";
import { useForm } from "react-hook-form";

const defaults = {
  nombre: "",
  cedula: "",
  expedicion: "",
  cargo: "",
  tipoContrato: "indefinido",
  fechaIngreso: "",
  salario: "",
  auxilioTransporte: true,
  telefono: "",
  direccion: "",
  activo: true,
};

export default function EmployeeForm({ initialData, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    reset(initialData ? { ...defaults, ...initialData } : defaults);
  }, [initialData, reset]);

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="nombre">Nombre completo</label>
        <input id="nombre" className="input mt-1" {...register("nombre", { required: "El nombre es obligatorio" })} />
        {errors.nombre ? <p className="mt-1 text-xs text-danger">{errors.nombre.message}</p> : null}
      </div>
      <div>
        <label className="label" htmlFor="cedula">Cédula</label>
        <input id="cedula" className="input mt-1" {...register("cedula", { required: "La cédula es obligatoria" })} />
        {errors.cedula ? <p className="mt-1 text-xs text-danger">{errors.cedula.message}</p> : null}
      </div>
      <div>
        <label className="label" htmlFor="expedicion">Lugar de expedición</label>
        <input id="expedicion" className="input mt-1" {...register("expedicion", { required: "El lugar es obligatorio" })} />
      </div>
      <div>
        <label className="label" htmlFor="cargo">Cargo</label>
        <input id="cargo" className="input mt-1" {...register("cargo", { required: "El cargo es obligatorio" })} />
      </div>
      <div>
        <label className="label" htmlFor="tipoContrato">Tipo de contrato</label>
        <select id="tipoContrato" className="input mt-1" {...register("tipoContrato")}>
          <option value="indefinido">Indefinido</option>
          <option value="fijo">Fijo</option>
          <option value="obra o labor">Obra o labor</option>
          <option value="prestación de servicios">Prestación de servicios</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="fechaIngreso">Fecha de ingreso</label>
        <input id="fechaIngreso" type="date" className="input mt-1" {...register("fechaIngreso", { required: "La fecha es obligatoria" })} />
      </div>
      <div>
        <label className="label" htmlFor="salario">Salario</label>
        <input id="salario" type="number" min="0" className="input mt-1" {...register("salario", { required: "El salario es obligatorio" })} />
      </div>
      <div>
        <label className="label" htmlFor="telefono">Teléfono</label>
        <input id="telefono" className="input mt-1" {...register("telefono")} />
      </div>
      <div>
        <label className="label" htmlFor="direccion">Dirección</label>
        <input id="direccion" className="input mt-1" {...register("direccion")} />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
        <input id="auxilioTransporte" type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("auxilioTransporte")} />
        <label className="text-sm font-semibold text-slate-700" htmlFor="auxilioTransporte">Recibe auxilio de transporte</label>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
        <input id="activo" type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("activo")} />
        <label className="text-sm font-semibold text-slate-700" htmlFor="activo">Empleada activa</label>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar empleada"}
        </button>
      </div>
    </form>
  );
}
