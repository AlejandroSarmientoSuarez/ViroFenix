import { createContext, useState, useContext, useCallback } from "react";
import { obtenerCarrito } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cantidadItems, setCantidadItems] = useState(0);
  const { usuario } = useAuth();

  const refrescarCarrito = useCallback(async () => {
    if (!usuario) {
      setCantidadItems(0);
      return;
    }
    try {
      const respuesta = await obtenerCarrito();
      const total = respuesta.data.items.reduce((acc, item) => acc + item.Cantidad, 0);
      setCantidadItems(total);
    } catch (err) {
      console.error(err);
    }
  }, [usuario]);

  return (
    <CartContext.Provider value={{ cantidadItems, refrescarCarrito }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}