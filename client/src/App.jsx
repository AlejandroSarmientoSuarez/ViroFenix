import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { registerToastHandler } from "./services/axiosConfig";
import RutaProtegida from "./components/RutaProtegida";
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
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import ProductoDetalle from "./pages/ProductoDetalle";
import MisPedidos from "./pages/MisPedidos";
import NotFound from "./pages/NotFound";

function ToastBridge() {
  const { showToast } = useToast();
  useEffect(() => { registerToastHandler(showToast); }, [showToast]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ToastBridge />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/recuperar" element={<RecuperarPassword />} />
              <Route path="/restablecer" element={<RestablecerPassword />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/coleccion" element={<Coleccion />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
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
                path="/pedidos"
                element={
                  <RutaProtegida>
                    <MisPedidos />
                  </RutaProtegida>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;   