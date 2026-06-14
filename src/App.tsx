import { Navigate, Route, Routes } from "react-router-dom";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminFeaturedProductsPage } from "@/pages/admin/AdminFeaturedProductsPage";
import { AdminFeedbacksPage } from "@/pages/admin/AdminFeedbacksPage";
import { AdminNoticesPage } from "@/pages/admin/AdminNoticesPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminPromotionsPage } from "@/pages/admin/AdminPromotionsPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { AdminVotesPage } from "@/pages/admin/AdminVotesPage";
import { ClientDashboard } from "@/pages/client/ClientDashboard";
import { ClientFeedbackPage } from "@/pages/client/ClientFeedbackPage";
import { ClientMenuPage } from "@/pages/client/ClientMenuPage";
import { ClientProfilePage } from "@/pages/client/ClientProfilePage";
import { ClientVotingPage } from "@/pages/client/ClientVotingPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { useAppStore } from "@/store/appStore";

export function App() {
  const user = useAppStore((state) => state.user);
  const home = user?.role === "admin" ? "/admin" : "/cliente";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? home : "/login"} replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute role="client" />}>
        <Route element={<ClientLayout />}>
          <Route path="/cliente" element={<ClientDashboard />} />
          <Route path="/cliente/votacao" element={<ClientVotingPage />} />
          <Route path="/cliente/feedbacks" element={<ClientFeedbackPage />} />
          <Route path="/cliente/cardapio" element={<ClientMenuPage />} />
          <Route path="/cliente/perfil" element={<ClientProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<AdminProductsPage />} />
          <Route path="/admin/votacoes" element={<AdminVotesPage />} />
          <Route path="/admin/promocoes" element={<AdminPromotionsPage />} />
          <Route
            path="/admin/produtos-dia"
            element={<AdminFeaturedProductsPage mode="day" />}
          />
          <Route
            path="/admin/produtos-semana"
            element={<AdminFeaturedProductsPage mode="week" />}
          />
          <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
          <Route path="/admin/avisos" element={<AdminNoticesPage />} />
          <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
