import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerCarrito, crearPedido } from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";

import "../assets/css/checkout.css";

const FORM_INICIAL = {
  email: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  titular: "",
  numero: "",
  vencimiento: "",
  cvv: "",
};

// Admite respuestas del backend con o sin una propiedad "data".
function normalizarRespuesta(respuesta) {
  let datos = respuesta?.data ?? respuesta;

  if (
    datos?.data &&
    !Array.isArray(datos.items) &&
    !Array.isArray(datos.productos)
  ) {
    datos = datos.data;
  }

  return datos ?? {};
}

function obtenerItems(datos) {
  if (Array.isArray(datos?.items)) return datos.items;
  if (Array.isArray(datos?.productos)) return datos.productos;
  if (Array.isArray(datos?.detalles)) return datos.detalles;
  return [];
}

function obtenerClave(item, indice) {
  return (
    item?.ProductoID ??
    item?.productoId ??
    item?.producto_id ??
    item?.id ??
    item?.CarritoDetalleID ??
    `producto-${indice}`
  );
}

function validar(f) {
  const e = {};

  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
    e.email = "Ingresá un email válido";
  }

  if (f.direccion.trim().length < 5) {
    e.direccion = "Ingresá tu dirección";
  }

  if (f.ciudad.trim().length < 2) {
    e.ciudad = "Ingresá tu ciudad";
  }

  if (f.codigoPostal.trim().length < 3) {
    e.codigoPostal = "Código postal inválido";
  }

  if (f.titular.trim().length < 3) {
    e.titular = "Ingresá el nombre del titular";
  }

  const digitos = f.numero.replace(/\D/g, "");

  if (digitos.length < 13 || digitos.length > 19) {
    e.numero = "Número de tarjeta inválido";
  }

  const m = f.vencimiento.match(/^(\d{2})\/(\d{2})$/);

  if (!m) {
    e.vencimiento = "Usá el formato MM/AA";
  } else {
    const mes = Number(m[1]);
    const anio = 2000 + Number(m[2]);
    const hoy = new Date();

    const vencida =
      anio < hoy.getFullYear() ||
      (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);

    if (mes < 1 || mes > 12) {
      e.vencimiento = "Mes inválido";
    } else if (vencida) {
      e.vencimiento = "Tarjeta vencida";
    }
  }

  if (!/^\d{3,4}$/.test(f.cvv)) {
    e.cvv = "CVV inválido";
  }

  return e;
}

function Checkout() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [recibo, setRecibo] = useState(null);

  const { refrescarCarrito } = useCart();

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const respuesta = await obtenerCarrito();
        const datos = normalizarRespuesta(respuesta);
        const productos = obtenerItems(datos);

        if (!activo) return;

        setItems(productos);

        const totalCalculado = productos.reduce((suma, item) => {
          const cantidad = Number(item.Cantidad ?? item.cantidad ?? 1);
          const precio = Number(item.Precio ?? item.precio ?? 0);

          return suma + cantidad * precio;
        }, 0);

        setTotal(
          Number(datos.total ?? datos.Total ?? totalCalculado)
        );
      } catch (err) {
        console.error("Error al cargar el carrito:", err);

        if (activo) {
          setMensajeError(
            err.response?.data?.message ||
              err.response?.data?.mensaje ||
              "No se pudo cargar el carrito. Intentá nuevamente."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, []);

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));

    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }

    setMensajeError("");
  }

  function onNumero(e) {
    const limpio = e.target.value.replace(/\D/g, "").slice(0, 16);

    handleChange(
      "numero",
      limpio.replace(/(.{4})/g, "$1 ").trim()
    );
  }

  function onVencimiento(e) {
    const limpio = e.target.value.replace(/\D/g, "").slice(0, 4);

    handleChange(
      "vencimiento",
      limpio.length > 2
        ? `${limpio.slice(0, 2)}/${limpio.slice(2)}`
        : limpio
    );
  }

  function onCvv(e) {
    handleChange(
      "cvv",
      e.target.value.replace(/\D/g, "").slice(0, 4)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (procesando) return;

    const errs = validar(form);
    setErrores(errs);
    setMensajeError("");

    if (Object.keys(errs).length > 0) return;

    if (items.length === 0) {
      setMensajeError("Tu carrito está vacío.");
      return;
    }

    setProcesando(true);

    try {
      // Se conserva la simulación de pago original.
      await new Promise((r) => setTimeout(r, 1500));

      const datosEnvio = {
        email: form.email.trim(),
        direccion: `${form.direccion.trim()}, ${form.ciudad.trim()} (CP ${form.codigoPostal.trim()})`,
      };

      // cartService.js ya devuelve respuesta.data de Axios.
      const respuesta = await crearPedido(datosEnvio);
      const pedido = normalizarRespuesta(respuesta);

      // Algunos backends devuelven el pedido sin incluir sus productos.
      // En ese caso, conservamos los productos cargados antes de comprar.
      const itemsPedido = obtenerItems(pedido);
      const productosRecibo =
        itemsPedido.length > 0 ? itemsPedido : items;

      const fechaPedido =
        pedido.fecha ??
        pedido.Fecha ??
        pedido.createdAt ??
        new Date().toISOString();

      setRecibo({
        ...pedido,
        items: productosRecibo,
        fecha: fechaPedido,
        pedidoId:
          pedido.pedidoId ??
          pedido.PedidoID ??
          pedido.id ??
          pedido.ID ??
          null,
        email: pedido.email ?? datosEnvio.email,
        direccion: pedido.direccion ?? datosEnvio.direccion,
        total: Number(pedido.total ?? pedido.Total ?? total),
        ultimos4: form.numero.replace(/\D/g, "").slice(-4),
      });

      setForm(FORM_INICIAL);

      await refrescarCarrito();
    } catch (err) {
      console.error("Error al procesar el pedido:", err);

      setMensajeError(
        err.response?.data?.message ||
          err.response?.data?.mensaje ||
          "No se pudo procesar el pedido. Intentá nuevamente."
      );
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return <p className="checkout-loading">Cargando...</p>;
  }

  if (recibo) {
    const fecha = new Date(recibo.fecha);
    const itemsRecibo = obtenerItems(recibo);

    return (
      <div className="checkout-recibo">
        <span className="checkout-kicker">Pago aprobado</span>
        <h1>¡Gracias por tu compra!</h1>

        <p className="checkout-recibo-sub">
          Pedido #{recibo.pedidoId ?? "Registrado"}
        </p>

        <div className="recibo-datos">
          <div>
            <span>Fecha</span>
            <strong>
              {fecha.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>

          <div>
            <span>Hora</span>
            <strong>
              {fecha.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              hs
            </strong>
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
            <strong>
              Tarjeta terminada en {recibo.ultimos4}
            </strong>
          </div>
        </div>

        <div className="recibo-items">
          {itemsRecibo.map((item, indice) => {
            const nombre = item.Nombre ?? item.nombre ?? "Producto";
            const imagen = item.Imagen ?? item.imagen;
            const cantidad = Number(
              item.Cantidad ?? item.cantidad ?? 1
            );
            const precio = Number(
              item.Precio ?? item.precio ?? 0
            );

            return (
              <div
                key={obtenerClave(item, indice)}
                className="recibo-item"
              >
                {imagen && (
                  <img
                    src={`${IMG_BASE_URL}${imagen}`}
                    alt={nombre}
                  />
                )}

                <div>
                  <p>{nombre}</p>
                  <span>
                    {cantidad} × ${precio.toFixed(2)}
                  </span>
                </div>

                <strong>
                  ${(cantidad * precio).toFixed(2)}
                </strong>
              </div>
            );
          })}
        </div>

        <p className="recibo-total">
          Total:{" "}
          <span>${Number(recibo.total ?? 0).toFixed(2)}</span>
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

        {mensajeError && (
          <p className="checkout-error" role="alert">
            {mensajeError}
          </p>
        )}

        <Link to="/coleccion" className="carrito-seguir">
          Ver colección
        </Link>
      </div>
    );
  }

  const campo = (nombre, label, props = {}) => (
    <div
      className={`checkout-campo ${
        errores[nombre] ? "con-error" : ""
      }`}
    >
      <label htmlFor={nombre}>{label}</label>

      <input
        id={nombre}
        name={nombre}
        value={form[nombre]}
        onChange={(e) => handleChange(nombre, e.target.value)}
        aria-invalid={Boolean(errores[nombre])}
        {...props}
      />

      {errores[nombre] && <small>{errores[nombre]}</small>}
    </div>
  );

  return (
    <div className="checkout-container">
      <h1>Finalizar compra</h1>

      <p className="checkout-aviso">
        Simulación: no se realiza ningún cobro real. Usá datos de prueba.
      </p>

      {mensajeError && (
        <p className="checkout-error" role="alert">
          {mensajeError}
        </p>
      )}

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset>
            <legend>Contacto</legend>

            {campo("email", "Email", {
              type: "email",
              placeholder: "tucorreo@ejemplo.com",
              autoComplete: "email",
            })}
          </fieldset>

          <fieldset>
            <legend>Dirección de envío</legend>

            {campo("direccion", "Dirección", {
              placeholder: "Calle y número, piso/depto",
              autoComplete: "street-address",
            })}

            <div className="checkout-fila">
              {campo("ciudad", "Ciudad", {
                placeholder: "Buenos Aires",
                autoComplete: "address-level2",
              })}

              {campo("codigoPostal", "Código postal", {
                placeholder: "1425",
                inputMode: "numeric",
                autoComplete: "postal-code",
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Pago con tarjeta de crédito o débito</legend>

            {campo("titular", "Titular de la tarjeta", {
              placeholder: "Como figura en la tarjeta",
              autoComplete: "cc-name",
            })}

            <div className="checkout-campo-wrap">
              <div
                className={`checkout-campo ${
                  errores.numero ? "con-error" : ""
                }`}
              >
                <label htmlFor="numero">Número de tarjeta</label>

                <input
                  id="numero"
                  name="numero"
                  value={form.numero}
                  onChange={onNumero}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-invalid={Boolean(errores.numero)}
                />

                {errores.numero && (
                  <small>{errores.numero}</small>
                )}
              </div>
            </div>

            <div className="checkout-fila">
              <div
                className={`checkout-campo ${
                  errores.vencimiento ? "con-error" : ""
                }`}
              >
                <label htmlFor="vencimiento">Vencimiento</label>

                <input
                  id="vencimiento"
                  name="vencimiento"
                  value={form.vencimiento}
                  onChange={onVencimiento}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  aria-invalid={Boolean(errores.vencimiento)}
                />

                {errores.vencimiento && (
                  <small>{errores.vencimiento}</small>
                )}
              </div>

              <div
                className={`checkout-campo ${
                  errores.cvv ? "con-error" : ""
                }`}
              >
                <label htmlFor="cvv">CVV</label>

                <input
                  id="cvv"
                  name="cvv"
                  value={form.cvv}
                  onChange={onCvv}
                  placeholder="123"
                  inputMode="numeric"
                  type="password"
                  autoComplete="cc-csc"
                  aria-invalid={Boolean(errores.cvv)}
                />

                {errores.cvv && <small>{errores.cvv}</small>}
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="checkout-boton"
            disabled={procesando}
          >
            {procesando
              ? "Procesando pago..."
              : `Pagar $${Number(total).toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-resumen">
          <h2>Tu pedido</h2>

          {items.map((item, indice) => {
            const nombre = item.Nombre ?? item.nombre ?? "Producto";
            const imagen = item.Imagen ?? item.imagen;
            const cantidad = Number(
              item.Cantidad ?? item.cantidad ?? 1
            );
            const precio = Number(
              item.Precio ?? item.precio ?? 0
            );

            return (
              <div
                key={obtenerClave(item, indice)}
                className="checkout-resumen-item"
              >
                {imagen && (
                  <img
                    src={`${IMG_BASE_URL}${imagen}`}
                    alt={nombre}
                  />
                )}

                <div>
                  <p>{nombre}</p>
                  <span>
                    {cantidad} × ${precio.toFixed(2)}
                  </span>
                </div>

                <strong>
                  ${(cantidad * precio).toFixed(2)}
                </strong>
              </div>
            );
          })}

          <p className="checkout-resumen-total">
            Total <span>${Number(total).toFixed(2)}</span>
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