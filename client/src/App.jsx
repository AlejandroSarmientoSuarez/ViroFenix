import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import RutaProtegida from "./components/RutaProtegida";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import Coleccion from "./pages/Coleccion";
import Contacto from "./pages/contacto";
import Carrito from "./pages/Carrito";
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import ProductoDetalle from "./pages/ProductoDetalle";

function App() {
  return (
    <BrowserRouter>
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
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;