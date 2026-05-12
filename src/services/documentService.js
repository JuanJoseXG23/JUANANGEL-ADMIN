import { createRecord, existsRecord, listRecent } from "./firestoreService";

export function registerDocument(payload) {
  return createRecord("documentos", payload);
}

export function registerPaySlip(payload) {
  return createRecord("colillas", payload);
}

export function paySlipExists({ empleadoId, ano, mes, quincena }) {
  return existsRecord("colillas", [
    ["empleadoId", "==", empleadoId],
    ["ano", "==", ano],
    ["mes", "==", mes],
    ["quincena", "==", quincena],
  ]);
}

export function getRecentDocuments(qty = 5) {
  return listRecent("documentos", qty);
}

export function getRecentPaySlips(qty = 5) {
  return listRecent("colillas", qty);
}
