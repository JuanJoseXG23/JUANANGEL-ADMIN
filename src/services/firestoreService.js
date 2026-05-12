import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

function ensureFirebase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase no está configurado. Revisa el archivo .env.");
  }
}

function serializeDoc(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

export async function listCollection(collectionName, constraints = []) {
  ensureFirebase();
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(query(ref, ...constraints));
  return snapshot.docs.map(serializeDoc);
}

export async function createRecord(collectionName, payload) {
  ensureFirebase();
  const ref = await addDoc(collection(db, collectionName), {
    ...payload,
    fechaCreacion: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRecord(collectionName, id, payload) {
  ensureFirebase();
  await updateDoc(doc(db, collectionName, id), {
    ...payload,
    fechaActualizacion: serverTimestamp(),
  });
}

export async function deleteRecord(collectionName, id) {
  ensureFirebase();
  await deleteDoc(doc(db, collectionName, id));
}

export async function listRecent(collectionName, qty = 5) {
  ensureFirebase();
  return listCollection(collectionName, [orderBy("fechaCreacion", "desc"), limit(qty)]);
}

export async function existsRecord(collectionName, filters = []) {
  ensureFirebase();
  const constraints = filters.map(([field, operator, value]) => where(field, operator, value));
  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints, limit(1)));
  return !snapshot.empty;
}
