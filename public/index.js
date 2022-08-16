const socket = io();

function agregarProducto() {
  const title = document.getElementById("form-title").value;
  const price = document.getElementById("form-price").value;
  const thumbnail = document.getElementById("form-thumbnail").value;
  const type = document.getElementById("form-type").value;

  const productToAdd = {
    title: title,
    price: price,
    thumbnail: thumbnail,
    type: type,
  };

  socket.emit("agregar-producto", productToAdd);

  return false;
}

function armarTablaProductos(listaProductos) {
  let tablaProductosHTML = `<tr>
    <th>Titulo</th>
    <th>Precio</th>
    <th>Imágen</th>
  </tr>`;
  listaProductos.forEach((element) => {
    tablaProductosHTML += `<tr>
            <td>${element.title}</td>
            <td>${element.price}</td>
            <td><img src="${element.thumbnail}" /></td>
          </tr>`;
  });

  document.getElementById("tabla-productos").innerHTML = tablaProductosHTML;
}

function enviarMensaje() {
  const email = document.getElementById("form-chat-email").value;
  const mensaje = document.getElementById("form-chat-mensaje").value;

  if (!email) {
    document.getElementById("empty-email-error").innerHTML =
      "Por favor, ingrese su email para poder enviar un mensaje";
  } else {
    socket.emit("chat", {
      email: email,
      mensaje: mensaje,
    });
    document.getElementById("empty-email-error").innerHTML = "";
  }
  return false;
}

socket.on("lista-productos-actualizada", (listaProductos) => {
  armarTablaProductos(listaProductos);
});

socket.on("chat-actualizado", (mensajes) => {
  const html = mensajes.reduce(
    (html, item) =>
      `<p><span class='chat-email-color'>${item.email}</span><span class='fecha-hora'> [${item.fechaHora}]: </span><span class='chat-mensaje-color'>${item.mensaje}</span></p>` +
      html,
    ""
  );
  document.getElementById("chat-mensajes").innerHTML = html;
});
