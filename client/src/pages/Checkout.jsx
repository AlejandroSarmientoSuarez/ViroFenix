import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerCarrito, crearPedido } from "../services/cartService";
import { IMG_BASE_URL } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
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

function validar(f) {
  const e = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Ingresá un email válido";
  if (f.direccion.trim().length < 5) e.direccion = "Ingresá tu dirección";
  if (f.ciudad.trim().length < 2) e.ciudad = "Ingresá tu ciudad";
  if (f.codigoPostal.trim().length < 3) e.codigoPostal = "Código postal inválido";
  if (f.titular.trim().length < 3) e.titular = "Ingresá el nombre del titular";

  const digitos = f.numero.replace(/\s/g, "");
  if (digitos.length < 13 || digitos.length > 19) e.numero = "Número de tarjeta inválido";

  const m = f.vencimiento.match(/^(\d{2})\/(\d{2})$/);
  if (!m) {
    e.vencimiento = "Usá el formato MM/AA";
  } else {
    const mes = Number(m[1]);
    const anio = 2000 + Number(m[2]);
    const hoy = new Date();
    const vencida = anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
    if (mes < 1 || mes > 12) e.vencimiento = "Mes inválido";
    else if (vencida) e.vencimiento = "Tarjeta vencida";
  }

  if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = "CVV inválido";
  return e;
}

function Checkout() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [recibo, setRecibo] = useState(null);
  const { refrescarCarrito } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await obtenerCarrito();
        setItems(respuesta.data.items);
        setTotal(respuesta.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
  }

  function onNumero(e) {
    const limpio = e.target.value.replace(/\D/g, "").slice(0, 16);
    handleChange("numero", limpio.replace(/(.{4})/g, "$1 ").trim());
  }

  function onVencimiento(e) {
    const limpio = e.target.value.replace(/\D/g, "").slice(0, 4);
    handleChange("vencimiento", limpio.length > 2 ? `${limpio.slice(0, 2)}/${limpio.slice(2)}` : limpio);
  }

  function onCvv(e) {
    handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validar(form);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setProcesando(true);
    try {
      // Simula el procesamiento del pago
      await new Promise((r) => setTimeout(r, 1500));

      // Solo viajan email y dirección; la tarjeta NUNCA sale del navegador
      const respuesta = await crearPedido({
        email: form.email.trim(),
        direccion: `${form.direccion.trim()}, ${form.ciudad.trim()} (CP ${form.codigoPostal.trim()})`,
      });

      setRecibo({
        ...respuesta.data,
        ultimos4: form.numero.replace(/\s/g, "").slice(-4),
      });
      setForm(FORM_INICIAL);
      await refrescarCarrito();
    } catch (err) {
      showToast(err.response?.data?.message || "No se pudo procesar el pago", "error");
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <p className="checkout-loading">Cargando...</p>;

  if (recibo) {
    const fecha = new Date(recibo.fecha);
    return (
      <div className="checkout-recibo">
        <span className="checkout-kicker">Pago aprobado</span>
        <h1>¡Gracias por tu compra!</h1>
        <p className="checkout-recibo-sub">Pedido #{recibo.pedidoId}</p>

        <div className="recibo-datos">
          <div>
            <span>Fecha</span>
            <strong>{fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</strong>
          </div>
          <div>
            <span>Hora</span>
            <strong>{fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs</strong>
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
          {recibo.items.map((item) => (
            <div key={item.ProductoID} className="recibo-item">
              <img src={`${IMG_BASE_URL}${item.Imagen}`} alt={item.Nombre} />
              <div>
                <p>{item.Nombre}</p>
                <span>{item.Cantidad} × ${item.Precio}</span>
              </div>
              <strong>${(item.Cantidad * item.Precio).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <p className="recibo-total">Total: <span>${Number(recibo.total).toFixed(2)}</span></p>

        <div className="recibo-acciones">
          <button className="checkout-boton checkout-boton--claro" onClick={() => window.print()}>
            Imprimir recibo
          </button>
          <Link to="/pedidos" className="carrito-seguir">Ver mis pedidos</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h1>No hay nada para pagar</h1>
        <Link to="/coleccion" className="carrito-seguir">Ver colección</Link>
      </div>
    );
  }

  const campo = (nombre, label, props = {}) => (
    <div className={`checkout-campo ${errores[nombre] ? "con-error" : ""}`}>
      <label htmlFor={nombre}>{label}</label>
      <input
        id={nombre}
        value={form[nombre]}
        onChange={(e) => handleChange(nombre, e.target.value)}
        {...props}
      />
      {errores[nombre] && <small>{errores[nombre]}</small>}
    </div>
  );

  return (
    <div className="checkout-container">
      <h1>Finalizar compra</h1>
      <p className="checkout-aviso">Simulación: no se realiza ningún cobro real. Usá datos de prueba.</p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Contacto</legend>
            {campo("email", "Email", { type: "email", placeholder: "tucorreo@ejemplo.com", autoComplete: "email" })}
          </fieldset>

          <fieldset>
            <legend>Dirección de envío</legend>
            {campo("direccion", "Dirección", { placeholder: "Calle y número, piso/depto", autoComplete: "street-address" })}
            <div className="checkout-fila">
              {campo("ciudad", "Ciudad", { placeholder: "Buenos Aires" })}
              {campo("codigoPostal", "Código postal", { placeholder: "1425", inputMode: "numeric" })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Pago con tarjeta de crédito o débito</legend>
            {campo("titular", "Titular de la tarjeta", { placeholder: "Como figura en la tarjeta", autoComplete: "off" })}
            <div className="checkout-campo-wrap">
              <div className={`checkout-campo ${errores.numero ? "con-error" : ""}`}>
                <label htmlFor="numero">Número de tarjeta</label>
                <input
                  id="numero"
                  value={form.numero}
                  onChange={onNumero}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="off"
                />
                {errores.numero && <small>{errores.numero}</small>}
              </div>
            </div>
            <div className="checkout-fila">
              <div className={`checkout-campo ${errores.vencimiento ? "con-error" : ""}`}>
                <label htmlFor="vencimiento">Vencimiento</label>
                <input
                  id="vencimiento"
                  value={form.vencimiento}
                  onChange={onVencimiento}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  autoComplete="off"
                />
                {errores.vencimiento && <small>{errores.vencimiento}</small>}
              </div>
              <div className={`checkout-campo ${errores.cvv ? "con-error" : ""}`}>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  value={form.cvv}
                  onChange={onCvv}
                  placeholder="123"
                  inputMode="numeric"
                  type="password"
                  autoComplete="off"
                />
                {errores.cvv && <small>{errores.cvv}</small>}
              </div>
            </div>
          </fieldset>

          <button type="submit" className="checkout-boton" disabled={procesando}>
            {procesando ? "Procesando pago..." : `Pagar $${Number(total).toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout-resumen">
          <h2>Tu pedido</h2>
          {items.map((item) => (
            <div key={item.CarritoDetalleID} className="checkout-resumen-item">
              <img src={`${IMG_BASE_URL}${item.Imagen}`} alt={item.Nombre} />
              <div>
                <p>{item.Nombre}</p>
                <span>{item.Cantidad} × ${item.Precio}</span>
              </div>
              <strong>${(item.Cantidad * item.Precio).toFixed(2)}</strong>
            </div>
          ))}
          <p className="checkout-resumen-total">Total <span>${Number(total).toFixed(2)}</span></p>
          <Link to="/carrito" className="carrito-seguir">Volver al carrito</Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;