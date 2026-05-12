import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Banknote,
  FileText,
  History,
  Home,
  Menu,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/empleadas", label: "Empleadas", icon: UsersRound },
  { to: "/cartas", label: "Cartas", icon: FileText },
  { to: "/colillas", label: "Colillas", icon: Banknote },
  { to: "/historial", label: "Historial", icon: History },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">JUANANGEL S.A.S</p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">Panel Administrativo</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              ].join(" ")
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-5 py-4">
        <p className="text-xs text-slate-500">Gestión interna sin autenticación. Datos conectados a Firebase Firestore.</p>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar navegación"
          />
          <aside className="relative h-full w-[18rem] max-w-[82vw] bg-white shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">JUANANGEL S.A.S</p>
              <p className="text-sm font-bold text-slate-950">Administración</p>
            </div>
            <button
              type="button"
              className="rounded-md border border-slate-200 bg-white p-2 text-slate-700"
              onClick={toggleSidebar}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
