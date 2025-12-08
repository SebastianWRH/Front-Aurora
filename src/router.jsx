import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./Pages/Home";
import Catalogo from "./Pages/Catalogo";
import Producto from "./Pages/Producto";
import Contacto from "./Pages/Contac";
import Checkout from "./Pages/Checkout";
import Diosito from "./Pages/Admin"
import OrderStatus from './Pages/OrderStatus';

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
        path:"/Checkout",
        element: <Checkout />
      },
      {
        path:"/diosito",
        element: <Diosito />
      },
      {
        path:"/rastrear-pedido",
        element: <OrderStatus />
      },
      {
        path: "/producto/:id",
        element: <Producto />
      }
    ]
  }
]);

export default router;