import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import type { UserRole } from "@/types";

export function ProtectedRoute({ role }: { role: UserRole }) {
  const user = useAppStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/cliente"} replace />;
  }

  return <Outlet />;
}
