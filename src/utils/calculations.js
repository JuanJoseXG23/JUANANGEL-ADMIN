import { endOfMonth, format, parseISO } from "date-fns";

export const MONTHLY_TRANSPORT_ALLOWANCE = 200000;

function toNumber(value) {
  return Number(value || 0);
}

export function getDefaultPayrollMonth() {
  return format(new Date(), "yyyy-MM");
}

export function getPayPeriod(month = getDefaultPayrollMonth(), quincena = 1) {
  const normalizedQuincena = Number(quincena) === 2 ? 2 : 1;
  const [yearValue, monthValue] = month.split("-").map(Number);
  const startDay = normalizedQuincena === 1 ? "01" : "16";
  const startDate = parseISO(`${month}-${startDay}`);
  const finalDay = normalizedQuincena === 1 ? 15 : endOfMonth(startDate).getDate();
  const endDate = parseISO(`${month}-${String(finalDay).padStart(2, "0")}`);

  return {
    ano: yearValue,
    mesNumero: monthValue,
    fechaInicio: format(startDate, "yyyy-MM-dd"),
    fechaFin: format(endDate, "yyyy-MM-dd"),
    periodo: `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`,
    quincena: normalizedQuincena,
  };
}

export function calculatePaySlip(employee = {}, values = {}) {
  const period = getPayPeriod(values.mes, values.quincena);
  const salarioMensual = toNumber(employee.salario);
  const salarioBase = Math.round(salarioMensual / 2);
  const auxilioTransporte = employee.auxilioTransporte ? Math.round(MONTHLY_TRANSPORT_ALLOWANCE / 2) : 0;
  const eps = toNumber(values.eps);
  const pension = toNumber(values.pension);
  const otrasDeducciones = toNumber(values.otrasDeducciones);
  const totalDeducciones = eps + pension + otrasDeducciones;
  const totalDevengado = salarioBase + auxilioTransporte;
  const netoPagar = Math.max(totalDevengado - totalDeducciones, 0);

  return {
    ...period,
    salarioMensual,
    salarioBase,
    auxilioTransporte,
    eps,
    pension,
    otrasDeducciones,
    deducciones: totalDeducciones,
    totalDevengado,
    totalDeduccion: totalDeducciones,
    netoPagar,
  };
}
