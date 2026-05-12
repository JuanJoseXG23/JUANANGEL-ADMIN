import { orderBy } from "firebase/firestore";
import { createRecord, deleteRecord, listCollection, updateRecord } from "./firestoreService";
import { normalizeEmployee } from "../utils/formatters";

const COLLECTION = "empleadas";

export function getEmployees() {
  return listCollection(COLLECTION, [orderBy("nombre", "asc")]);
}

export function createEmployee(data) {
  return createRecord(COLLECTION, normalizeEmployee(data));
}

export function updateEmployee(id, data) {
  return updateRecord(COLLECTION, id, normalizeEmployee(data));
}

export function deleteEmployee(id) {
  return deleteRecord(COLLECTION, id);
}
