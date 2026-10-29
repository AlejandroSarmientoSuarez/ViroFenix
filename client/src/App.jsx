import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import RutaProtegida from "./components/RutaProtegida";
import RutaAdmin from "./components/RutaAdmin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import Coleccion from "./pages/Coleccion";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/contacto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Faq from "./pages/Faq";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminPedidos from "./pages/AdminPedidos";
import AdminStock from "./pages/AdminStock";
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import ProductoDetalle from "./pages/ProductoDetalle";
import MisPedidos from "./pages/MisPedidos";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/coleccion" element={<Coleccion />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/faq" element={<Faq />} />

            <Route path="/recuperar" element={<RecuperarPassword />} />
            <Route path="/restablecer" element={<RestablecerPassword />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />

            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />

            <Route
              path="/carrito"
              element={
                <RutaProtegida>
                  <Carrito />
                </RutaProtegida>
              }
            />

            <Route
              path="/checkout"
              element={
                <RutaProtegida>
                  <Checkout />
                </RutaProtegida>
              }
            />

            <Route
              path="/pedidos"
              element={
                <RutaProtegida>
                  <MisPedidos />
                </RutaProtegida>
              }
            />

            <Route
              path="/admin/pedidos"
              element={
                <RutaAdmin>
                  <AdminPedidos />
                </RutaAdmin>
              }
            />

            <Route
              path="/admin/stock"
              element={
                <RutaAdmin>
                  <AdminStock />
                </RutaAdmin>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <RutaAdmin>
                  <AdminUsuarios />
                </RutaAdmin>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;