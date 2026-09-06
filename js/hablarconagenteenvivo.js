(function () {
  const form = document.getElementById("consulta-form");
  const btnEnviar = document.getElementById("btnEnviar");
  const btnChatAgente = document.getElementById("btnChatAgente");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalButtons = modalOverlay.querySelectorAll("button[data-service]");
  const closeModalBtn = document.getElementById("closeModal");
  const destinatario = "nunezbarucalexander@gmail.com";

btnEnviar.addEventListener("click", () => {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  modalOverlay.style.display = "flex"; // aquí sí se muestra
});

  btnChatAgente.addEventListener("click", () => {
    const whatsappLink = "https://wa.me/12345678901?text=Hola,%20quiero%20hablar%20con%20un%20agente%20en%20vivo.";
    window.open(whatsappLink, "_blank");
  });

  function cerrarModal() {
    modalOverlay.style.display = "none";
    btnEnviar.focus();
  }

  closeModalBtn.addEventListener("click", cerrarModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.style.display === "flex") {
      cerrarModal();
    }
  });

  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tipo = form.tipo_consulta.value;
      const descripcionText = form.descripcion.value.trim();

      alert(
        "Gracias por tu consulta. Recibirás una respuesta en 24 a 72 horas hábiles en tu correo electrónico."
      );

      const asunto = encodeURIComponent("Consulta: " + tipo);
      const cuerpo = encodeURIComponent(
        "Descripción de la consulta:\n" +
          descripcionText +
          "\n\nGracias por tu consulta. Responderemos en un plazo de 24 a 72 horas hábiles."
      );

      let url = "";
      switch (button.dataset.service) {
        case "gmail":
          url = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`;
          break;
        case "outlook":
          url = `https://outlook.office.com/mail/deeplink/compose?to=${destinatario}&subject=${asunto}&body=${cuerpo}`;
          break;
        case "yahoo":
          url = `https://compose.mail.yahoo.com/?to=${destinatario}&subject=${asunto}&body=${cuerpo}`;
          break;
      }

      window.open(url, "_blank");
      cerrarModal();
      form.reset();
    });
  });
})();
