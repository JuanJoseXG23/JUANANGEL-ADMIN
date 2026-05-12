# JUANANGEL S.A.S Admin

Aplicación web interna para gestionar empleadas, generar cartas laborales y crear colillas de pago desde React, Firebase Firestore y PDFs dinámicos.

## Arquitectura

```txt
src/
  components/   Componentes reutilizables de UI, empleadas y documentos
  firebase/     Inicialización Firebase
  hooks/        Hooks compartidos
  layouts/      Layout responsive con sidebar
  pages/        Rutas principales
  services/     Firestore y generación PDF
  store/        Estado global con Zustand
  styles/       Tailwind y estilos base
  templates/    Constantes visuales para documentos PDF
  utils/        Formatos, cálculos y normalización
```

## Instalación

```bash
npm install
npm run dev
```

## Configuración Firebase

1. Crea un proyecto en Firebase.
2. Activa Firestore Database.
3. Registra una aplicación web.
4. Copia `.env.example` como `.env`.
5. Completa las variables `VITE_FIREBASE_*`.

Colecciones usadas:

- `empleadas`
- `documentos`
- `colillas`
- `plantillasCartas`

Modelo principal de empleada:

```js
{
  nombre: "",
  cedula: "",
  expedicion: "",
  cargo: "",
  tipoContrato: "",
  fechaIngreso: "",
  salario: 0,
  auxilioTransporte: true,
  telefono: "",
  direccion: "",
  activo: true,
  fechaCreacion: ""
}
```

## GitHub Pages

Actualiza `homepage` en `package.json` y `VITE_BASE_PATH` en `.env`:

```bash
VITE_BASE_PATH=/NOMBRE_DEL_REPOSITORIO/
```

Luego despliega:

```bash
npm run deploy
```

La app usa `HashRouter`, así que las rutas internas funcionan al refrescar en GitHub Pages sin configurar servidor.

## Módulos

- Dashboard con métricas y últimos documentos.
- CRUD completo de empleadas.
- Generación de cartas laborales en PDF con `pdf-lib`.
- Editor de cartas laborales con variables dinámicas y plantillas en Firestore.
- Generación de colillas de pago con cálculo quincenal automático, deducciones separadas y control de duplicados.
- Historial Firestore de documentos generados, sin almacenar PDFs.
