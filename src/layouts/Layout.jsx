import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "../Components/WhatsApp/FloatingWhatsApp";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Layout;
