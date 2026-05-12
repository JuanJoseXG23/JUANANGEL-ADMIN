import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { calculatePaySlip, getDefaultPayrollMonth } from "../../utils/calculations";
import { formatMoney } from "../../utils/formatters";

export default function PaySlipForm({ employee, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mes: getDefaultPayrollMonth(),
      quincena: 1,
      eps: 0,
      pension: 0,
      otrasDeducciones: 0,
    },
  });

  useEffect(() => {
    reset({
      mes: getDefaultPayrollMonth(),
      quincena: 1,
      eps: 0,
      pension: 0,
      otrasDeducciones: 0,
    });
  }, [employee, reset]);

  const values = watch();
  const totals = calculatePaySlip(employee, values);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="label" htmlFor="mes">Mes de pago</label>
          <input id="mes" type="month" className="input mt-1" {...register("mes", { required: "Selecciona el mes" })} />
          {errors.mes ? <p className="mt-1 text-xs text-danger">{errors.mes.message}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="quincena">Quincena</label>
          <select id="quincena" className="input mt-1" {...register("quincena")}>
            <option value={1}>1 al 15</option>
            <option value={2}>16 al final</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="eps">EPS</label>
          <input id="eps" type="number" min="0" className="input mt-1" {...register("eps")} />
        </div>
        <div>
          <label className="label" htmlFor="pension">Pensión</label>
          <input id="pension" type="number" min="0" className="input mt-1" {...register("pension")} />
        </div>
        <div>
          <label className="label" htmlFor="otrasDeducciones">Otras deducciones</label>
          <input id="otrasDeducciones" type="number" min="0" className="input mt-1" {...register("otrasDeducciones")} />
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-slate-400 bg-white p-3 font-mono text-[11px] leading-tight text-slate-950">
        <div className="min-w-[680px]">
          <div className="mb-2 text-center text-[12px] font-bold">CREACIONES JUANANGEL S.A.S - COLILLA DE PAGO</div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-slate-500 px-1 py-1 font-bold">APELLIDOS Y NOMBRE</td>
                <td className="border border-slate-500 px-1 py-1" colSpan={4}>{employee?.nombre}</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1 font-bold">IDENTIFICACION</td>
                <td className="border border-slate-500 px-1 py-1">{employee?.cedula}</td>
                <td className="border border-slate-500 px-1 py-1 font-bold">C DE C</td>
                <td className="border border-slate-500 px-1 py-1">C DE C</td>
                <td className="border border-slate-500 px-1 py-1">{employee?.cargo}</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1 font-bold">V.HORA</td>
                <td className="border border-slate-500 px-1 py-1">0</td>
                <td className="border border-slate-500 px-1 py-1 font-bold">PERIODO</td>
                <td className="border border-slate-500 px-1 py-1" colSpan={2}>{totals.periodo}</td>
              </tr>
            </tbody>
          </table>

          <table className="mt-2 w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-500 px-1 py-1 text-left">LIQUIDACION</th>
                <th className="border border-slate-500 px-1 py-1 text-right">SERVICIO</th>
                <th className="border border-slate-500 px-1 py-1 text-right">DEDUCCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-500 px-1 py-1">Salario basico</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.salarioBase)}</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1">Sub-transporte</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.auxilioTransporte)}</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1">Otros conceptos</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1">EPS</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.eps)}</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1">Pension</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.pension)}</td>
              </tr>
              <tr>
                <td className="border border-slate-500 px-1 py-1">Otras deducciones</td>
                <td className="border border-slate-500 px-1 py-1 text-right">0</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.otrasDeducciones)}</td>
              </tr>
              <tr className="font-bold">
                <td className="border border-slate-500 px-1 py-1">Total Devengado</td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.totalDevengado)}</td>
                <td className="border border-slate-500 px-1 py-1 text-right"></td>
              </tr>
              <tr className="font-bold">
                <td className="border border-slate-500 px-1 py-1">Total Deduccion</td>
                <td className="border border-slate-500 px-1 py-1 text-right"></td>
                <td className="border border-slate-500 px-1 py-1 text-right">{formatMoney(totals.totalDeduccion)}</td>
              </tr>
              <tr className="font-bold">
                <td className="border border-slate-500 px-1 py-1">Neto a pagar</td>
                <td className="border border-slate-500 px-1 py-1 text-right" colSpan={2}>{formatMoney(totals.netoPagar)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Generando..." : "Generar PDF"}
        </button>
      </div>
    </form>
  );
}
