import { orderBy } from "firebase/firestore";
import { createRecord, listCollection } from "./firestoreService";

const COLLECTION = "plantillasCartas";

export function getLetterTemplates() {
  return listCollection(COLLECTION, [orderBy("fechaCreacion", "desc")]);
}

export function createLetterTemplate(payload) {
  return createRecord(COLLECTION, {
    nombrePlantilla: payload.nombrePlantilla,
    contenido: payload.contenido,
  });
}
