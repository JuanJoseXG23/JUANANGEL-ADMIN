import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatMoney(value = 0) {
  return currency.format(Number(value || 0));
}

export function formatDate(value, pattern = "d 'de' MMMM 'de' yyyy") {
  if (!value) return "Sin fecha";
  const date = typeof value === "string" ? parseISO(value) : value?.toDate?.() || value;
  return format(date, pattern, { locale: es });
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function normalizeEmployee(data) {
  return {
    nombre: data.nombre?.trim() || "",
    cedula: data.cedula?.trim() || "",
    expedicion: data.expedicion?.trim() || "",
    cargo: data.cargo?.trim() || "",
    tipoContrato: data.tipoContrato?.trim() || "",
    fechaIngreso: data.fechaIngreso || "",
    salario: Number(data.salario || 0),
    auxilioTransporte: Boolean(data.auxilioTransporte),
    telefono: data.telefono?.trim() || "",
    direccion: data.direccion?.trim() || "",
    activo: data.activo !== false,
  };
}

export function fileSafeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}
