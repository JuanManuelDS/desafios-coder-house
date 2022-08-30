const socket = io();

function agregarProducto() {
  const title = document.getElementById("form-title").value;
  const price = document.getElementById("form-price").value;
  const thumbnail = document.getElementById("form-thumbnail").value;
  const description = document.getElementById("form-description").value;

  const productToAdd = {
    title: title,
    price: price,
    thumbnail: thumbnail,
    description: description,
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
  const name = document.getElementById("form-chat-name").value;
  const email = document.getElementById("form-chat-email").value;
  const message = document.getElementById("form-chat-mensaje").value;

  if (!email) {
    document.getElementById("empty-email-error").innerHTML =
      "Por favor, ingrese su email para poder enviar un mensaje";
  } else {
    socket.emit("chat", {
      name: name,
      email: email,
      message: message,
    });
    document.getElementById("empty-email-error").innerHTML = "";
  }
  return false;
}

socket.on("lista-productos-actualizada", (listaProductos) => {
  console.log(listaProductos);
  armarTablaProductos(listaProductos);
});

socket.on("chat-actualizado", (mensajes) => {
  const html = mensajes.reduce(
    (html, item) =>
      `<p><span class='chat-email-color'>${item.email}</span><span class='fecha-hora'> [${item.name}]: </span><span class='chat-mensaje-color'>${item.message}</span></p>` +
      html,
    ""
  );
  document.getElementById("chat-mensajes").innerHTML = html;
});
