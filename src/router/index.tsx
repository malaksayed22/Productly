import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ProductsListPage from "../pages/ProductsListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import AddProductPage from "../pages/AddProductPage";
import EditProductPage from "../pages/EditProductPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import ActivityLogPage from "../pages/ActivityLogPage";
import RouterErrorBoundary from "../components/ui/RouterErrorBoundary";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <ProductsListPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/products/add",
    element: (
      <ProtectedRoute>
        <AddProductPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/products/:id",
    element: (
      <ProtectedRoute>
        <ProductDetailPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/products/:id/edit",
    element: (
      <ProtectedRoute>
        <EditProductPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    path: "/activity",
    element: (
      <ProtectedRoute>
        <ActivityLogPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorBoundary />,
  },
  {
    // 404 catch-all
    path: "*",
    element: <RouterErrorBoundary />,
  },
]);

export default router;
