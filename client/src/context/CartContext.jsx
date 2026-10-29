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
      const datos = respuesta?.data ?? respuesta;
      const carrito = datos?.carrito ?? datos?.data ?? datos;

      const items = Array.isArray(carrito)
        ? carrito
        : carrito?.items ?? carrito?.detalles ?? carrito?.productos ?? [];

      const total = Array.isArray(items)
        ? items.reduce(
            (suma, item) => suma + Number(item.Cantidad ?? item.cantidad ?? 0),
            0
          )
        : 0;

      setCantidadItems(total);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
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