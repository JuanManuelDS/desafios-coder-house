const socket = io();
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", enviarMensaje);

function enviarMensaje(e) {
  e.preventDefault();
  const name = document.getElementById("form-chat-name").value;
  const surname = document.getElementById("form-chat-surname").value;
  const age = document.getElementById("form-chat-age").value;
  const alias = document.getElementById("form-chat-alias").value;
  const email = document.getElementById("form-chat-email").value;
  const message = document.getElementById("form-chat-message").value;

  if (!email) {
    document.getElementById("empty-email-error").innerHTML =
      "Por favor, ingrese su email para poder enviar un mensaje";
  } else {
    console.log("entro aquí en el index.js del lado del cliente");
    socket.emit("chat", {
      author: { name, surname, age, alias, id: email },
      message,
    });
    document.getElementById("empty-email-error").innerHTML = "";
  }
}

socket.on("chat-actualizado", ({ messages, normalizedMessages }) => {
  let compression =
    (JSON.stringify(messages).length /
      JSON.stringify(normalizedMessages).length) *
    100;
  const html = messages.reduce(
    (html, item) =>
      `<p><span class='chat-email-color'>${item.author.id}</span><span class='fecha-hora'> [${item.author.name}]: </span><span class='chat-mensaje-color'>${item.message}</span></p>` +
      html,
    ""
  );
  document.getElementById("chat-mensajes").innerHTML = html;
  document.getElementById("porcentajeCompresion").innerHTML =
    "El porcentaje de compresión es de " +
    Math.floor(compression).toString() +
    "%";
});
