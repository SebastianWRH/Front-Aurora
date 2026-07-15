import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./Pages/Home";
import Catalogo from "./Pages/Catalogo";
import Producto from "./Pages/Producto";
import Contacto from "./Pages/Contac";
import Admin, { AdminLogin, AdminProtectedRoute } from "./Pages/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/catalogo",
        element: <Catalogo />
      },
      {
        path:"/Contacto",
        element: <Contacto />
      },
      {
        path: "/producto/:slug",
        element: <Producto />
      }
    ]
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/dashboard" replace />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/dashboard",
    element: <AdminProtectedRoute><Admin initialView="dashboard" /></AdminProtectedRoute>
  },
  {
    path: "/admin/productos",
    element: <AdminProtectedRoute><Admin initialView="products" /></AdminProtectedRoute>
  },
  {
    path: "/admin/categorias",
    element: <AdminProtectedRoute><Admin initialView="categories" /></AdminProtectedRoute>
  },
  {
    path: "/admin/configuracion",
    element: <AdminProtectedRoute><Admin initialView="settings" /></AdminProtectedRoute>
  }
]);

export default router;
