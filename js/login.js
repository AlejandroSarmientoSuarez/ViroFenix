function login(event){
  event.preventDefault();
  const info = {
    password: document.getElementById('password').value,
    user: document.getElementById('user').value
  }
  fetch("../server/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info)
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if(data.status === "ok") {
      window.location.href = "../views/index.php";
      document.cookie = `user=${info.user}; password=${info.password}; path=/; max-age=3600`; // 1 hora
      alert("Iniciaste sesion correctamente");
    } else {
      alert("Error: " + data.message);
      //const span = document.createElement("span")
      //span.textContent = data.message;
      //document.body.appendChild(span);
    }
  })
  .catch(err => console.error("Error en fetch:", err));

}