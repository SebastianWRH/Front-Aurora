import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./Pages/Home";
import Catalogo from "./Pages/Catalogo";
import Producto from "./Pages/Producto";
import Contacto from "./Pages/Contac";

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
  }
]);

export default router;
