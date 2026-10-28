
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerCarrito, crearPedido } from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";
import "../assets/css/checkout.css";

function Checkout() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [recibo, setRecibo] = useState(null);

  const [form, setForm] = useState({
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    titular: "",
    numero: "",
    vencimiento: "",
    cvv: ""
  });

  const { refrescarCarrito } = useCart();

  useEffect(() => {
    async function cargarCarrito() {
      try {
        const respuesta = await obtenerCarrito();
        let datos = respuesta.data || respuesta;

        if (datos.data && !datos.items) datos = datos.data;
        if (datos.carrito) datos = datos.carrito;

        const productos = Array.isArray(datos)
          ? datos
          : datos.items || datos.productos || datos.detalles || [];

        setItems(productos);

        let suma = 0;

        productos.forEach((item) => {
          const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
          const precio = Number(item.Precio ?? item.precio ?? 0);
          suma += cantidad * precio;
        });

        setTotal(Number(datos.total ?? datos.Total ?? suma));
      } catch {
        setMensaje("No se pudo cargar el carrito.");
      }

      setCargando(false);
    }

    cargarCarrito();
  }, []);

  function cambiarCampo(e) {
    const nombre = e.target.name;
    const valor = e.target.value;

    setForm({ ...form, [nombre]: valor });
    setMensaje("");
  }

  function validar() {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Ingresá un email válido.";
    }

    if (form.direccion.trim().length < 5) {
      return "Ingresá una dirección válida.";
    }

    if (form.ciudad.trim().length < 2) {
      return "Ingresá una ciudad válida.";
    }

    if (form.codigoPostal.trim().length < 3) {
      return "Ingresá un código postal válido.";
    }

    if (form.titular.trim().length < 3) {
      return "Ingresá el nombre del titular.";
    }

    const numero = form.numero.replace(/\D/g, "");

    if (numero.length < 13 || numero.length > 19) {
      return "El número de tarjeta no es válido.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.vencimiento)) {
      return "Usá el formato MM/AA para el vencimiento.";
    }

    const partes = form.vencimiento.split("/");
    const mes = Number(partes[0]);
    const anio = 2000 + Number(partes[1]);
    const hoy = new Date();

    if (
      anio < hoy.getFullYear() ||
      (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)
    ) {
      return "La tarjeta está vencida.";
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      return "El CVV no es válido.";
    }

    return "";
  }

  async function finalizarCompra(e) {
    e.preventDefault();

    if (procesando) return;

    const error = validar();

    if (error) {
      setMensaje(error);
      return;
    }

    if (items.length === 0) {
      setMensaje("Tu carrito está vacío.");
      return;
    }

    setProcesando(true);
    setMensaje("");

    try {
      const datosEnvio = {
        email: form.email.trim(),
        direccion: `${form.direccion.trim()}, ${form.ciudad.trim()} (CP ${form.codigoPostal.trim()})`
      };

      const respuesta = await crearPedido(datosEnvio);
      const pedido = respuesta.data || respuesta;

      setRecibo({
        items: items,
        total: Number(pedido.total ?? pedido.Total ?? total),
        email: datosEnvio.email,
        direccion: datosEnvio.direccion,
        numeroPedido: pedido.PedidoID ?? pedido.pedidoId ?? pedido.id ?? null,
        fecha: pedido.Fecha ?? pedido.fecha ?? new Date().toISOString(),
        ultimos4: form.numero.replace(/\D/g, "").slice(-4)
      });

      setForm({
        email: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        titular: "",
        numero: "",
        vencimiento: "",
        cvv: ""
      });

      await refrescarCarrito();
    } catch (error) {
      setMensaje(
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        "No se pudo crear el pedido."
      );
    }

    setProcesando(false);
  }

  if (cargando) {
    return <p className="checkout-loading">Cargando...</p>;
  }

  if (recibo) {
    const fecha = new Date(recibo.fecha);

    return (
      <div className="checkout-recibo">
        <span className="checkout-kicker">Pago aprobado</span>
        <h1>¡Gracias por tu compra!</h1>

        <p className="checkout-recibo-sub">
          Pedido #{recibo.numeroPedido ?? "Registrado"}
        </p>

        <div className="recibo-datos">
          <div>
            <span>Fecha</span>
            <strong>{fecha.toLocaleDateString("es-AR")}</strong>
          </div>

          <div>
            <span>Hora</span>
            <strong>{fecha.toLocaleTimeString("es-AR")} hs</strong>
          </div>

          <div>
            <span>Enviado a</span>
            <strong>{recibo.direccion}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{recibo.email}</strong>
          </div>

          <div>
            <span>Pago</span>
            <strong>Tarjeta terminada en {recibo.ultimos4}</strong>
          </div>
        </div>

        <div className="recibo-items">
          {recibo.items.map((item, indice) => {
            const nombre = item.Nombre ?? item.nombre ?? "Producto";
            const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
            const precio = Number(item.Precio ?? item.precio ?? 0);
            const imagen = item.Imagen ?? item.imagen ?? "";
            const id = item.ProductoID ?? item.productoId ?? indice;

            return (
              <div key={id} className="recibo-item">
                {imagen && (
                  <img
                    src={imagen.startsWith("http") ? imagen : IMG_BASE_URL + imagen}
                    alt={nombre}
                  />
                )}

                <div>
                  <p>{nombre}</p>
                  <span>{cantidad} × ${precio.toFixed(2)}</span>
                </div>

                <strong>${(cantidad * precio).toFixed(2)}</strong>
              </div>
            );
          })}
        </div>

        <p className="recibo-total">
          Total: <span>${recibo.total.toFixed(2)}</span>
        </p>

        <div className="recibo-acciones">
          <button
            type="button"
            className="checkout-boton checkout-boton--claro"
            onClick={() => window.print()}
          >
            Imprimir recibo
          </button>

          <Link to="/pedidos" className="carrito-seguir">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h1>No hay nada para pagar</h1>
        {mensaje && <p className="checkout-error">{mensaje}</p>}
        <Link to="/coleccion" className="carrito-seguir">
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Finalizar compra</h1>

      <p className="checkout-aviso">
        Simulación: no se realiza ningún cobro real. Usá datos de prueba.
      </p>

      {mensaje && <p className="checkout-error" role="alert">{mensaje}</p>}

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={finalizarCompra}>
          <fieldset>
            <legend>Contacto</legend>

            <div className="checkout-campo">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={cambiarCampo}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Dirección de envío</legend>

            <div className="checkout-campo">
              <label>Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={cambiarCampo}
                placeholder="Calle y número"
                required
              />
            </div>

            <div className="checkout-fila">
              <div className="checkout-campo">
                <label>Ciudad</label>
                <input
                  name="ciudad"
                  value={form.ciudad}
                  onChange={cambiarCampo}
                  required
                />
              </div>

              <div className="checkout-campo">
                <label>Código postal</label>
                <input
                  name="codigoPostal"
                  value={form.codigoPostal}
                  onChange={cambiarCampo}
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Pago con tarjeta</legend>

            <div className="checkout-campo">
              <label>Titular de la tarjeta</label>
              <input
                name="titular"
                value={form.titular}
                onChange={cambiarCampo}
                required
              />
            </div>

            <div className="checkout-campo">
              <label>Número de tarjeta</label>
              <input
                name="numero"
                value={form.numero}
                onChange={(e) => {
                  const numero = e.target.value.replace(/\D/g, "").slice(0, 19);
                  setForm({ ...form, numero });
                }}
                inputMode="numeric"
                required
              />
            </div>

            <div className="checkout-fila">
              <div className="checkout-campo">
                <label>Vencimiento (MM/AA)</label>
                <input
                  name="vencimiento"
                  value={form.vencimiento}
                  onChange={(e) => {
                    let valor = e.target.value.replace(/\D/g, "").slice(0, 4);

                    if (valor.length > 2) {
                      valor = valor.slice(0, 2) + "/" + valor.slice(2);
                    }

                    setForm({ ...form, vencimiento: valor });
                  }}
                  placeholder="MM/AA"
                  required
                />
              </div>

              <div className="checkout-campo">
                <label>CVV</label>
                <input
                  name="cvv"
                  type="password"
                  value={form.cvv}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4)
                    });
                  }}
                  required
                />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="checkout-boton"
            disabled={procesando}
          >
            {procesando ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-resumen">
          <h2>Tu pedido</h2>

          {items.map((item, indice) => {
            const nombre = item.Nombre ?? item.nombre ?? "Producto";
            const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
            const precio = Number(item.Precio ?? item.precio ?? 0);
            const imagen = item.Imagen ?? item.imagen ?? "";
            const id = item.ProductoID ?? item.productoId ?? indice;

            return (
              <div key={id} className="checkout-resumen-item">
                {imagen && (
                  <img
                    src={imagen.startsWith("http") ? imagen : IMG_BASE_URL + imagen}
                    alt={nombre}
                  />
                )}

                <div>
                  <p>{nombre}</p>
                  <span>{cantidad} × ${precio.toFixed(2)}</span>
                </div>

                <strong>${(cantidad * precio).toFixed(2)}</strong>
              </div>
            );
          })}

          <p className="checkout-resumen-total">
            Total <span>${total.toFixed(2)}</span>
          </p>

          <Link to="/carrito" className="carrito-seguir">
            Volver al carrito
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
