import { CheckCircle2, ExternalLink, Settings as SettingsIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { isFirebaseConfigured } from "../firebase/config";

const collections = [
  ["empleadas", "Datos laborales y contacto de cada empleada."],
  ["documentos", "Historial de cartas laborales generadas."],
  ["colillas", "Historial y totales de colillas de pago."],
  ["plantillasCartas", "Plantillas editables para cartas laborales."],
];

export default function Settings() {
  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Parámetros necesarios para operar con Firebase y desplegar en GitHub Pages."
        action={<SettingsIcon className="h-10 w-10 rounded-lg bg-brand-50 p-2 text-brand-700" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Firebase</h2>
          <div className={`mt-4 rounded-lg border p-4 ${isFirebaseConfigured ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <div className="flex gap-3">
              <CheckCircle2 className={`mt-0.5 h-5 w-5 ${isFirebaseConfigured ? "text-success" : "text-amber-700"}`} />
              <div>
                <p className="font-semibold text-slate-950">
                  {isFirebaseConfigured ? "Firebase configurado" : "Firebase pendiente"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Copia `.env.example` como `.env` y completa las variables del proyecto Firebase.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p>Crea Firestore en modo producción o prueba controlada y permite lectura/escritura para uso interno.</p>
            <p>Como no hay login, restringe el acceso al enlace de GitHub Pages a personal autorizado de la empresa.</p>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold text-slate-950">Colecciones Firestore</h2>
          <div className="mt-4 space-y-3">
            {collections.map(([name, description]) => (
              <div key={name} className="rounded-lg border border-slate-200 p-4">
                <p className="font-mono text-sm font-semibold text-slate-950">{name}</p>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-6 p-5">
        <h2 className="text-lg font-bold text-slate-950">GitHub Pages</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Ruta base</p>
            <p className="mt-1">Define `VITE_BASE_PATH=/NOMBRE_REPO/` antes de construir.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Despliegue</p>
            <p className="mt-1">Ejecuta `npm run deploy` cuando el repositorio remoto esté conectado.</p>
          </div>
        </div>
        <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700" href="https://firebase.google.com/docs/firestore" target="_blank" rel="noreferrer">
          Documentación Firestore <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
