import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Letters from "./pages/Letters.jsx";
import PaySlips from "./pages/PaySlips.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import ToastHost from "./components/ui/ToastHost.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="empleadas" element={<Employees />} />
          <Route path="cartas" element={<Letters />} />
          <Route path="colillas" element={<PaySlips />} />
          <Route path="historial" element={<History />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastHost />
    </>
  );
}
