import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatDate, formatMoney } from "./formatters";

export function getEmployeeVariables(employee = {}, overrides = {}) {
  return {
    nombre: employee.nombre || "",
    cedula: employee.cedula || "",
    expedicion: employee.expedicion || "",
    cargo: overrides.cargo || employee.cargo || "",
    tipoContrato: employee.tipoContrato || "",
    fechaIngreso: formatDate(employee.fechaIngreso),
    salario: formatMoney(employee.salario),
    fechaActual: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es }),
  };
}

export function renderTemplate(content = "", variables = {}) {
  return Object.entries(variables).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    content,
  );
}
