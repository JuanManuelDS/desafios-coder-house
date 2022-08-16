const Contenedor = require("./contenedor.js");
const express = require("express");
const app = express();
const fs = require("fs");
const moment = require("moment");
const { ChildProcess } = require("child_process");

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const { Router } = express;
const router = Router();
let productos = new Contenedor();

httpServer.listen(process.env.PORT || 8080);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);

//Aquí estoy seteando que cuando entren a localhost.com/ les devuelva index.html
app.get("/", (request, response) => {
  response.sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
  const chatHistory = getChat();
  console.log(chatHistory);
  //Aquí envío la tabla de productos al momento en que un cliente se conecta
  socket.emit("lista-productos-actualizada", productos.getAll());
  socket.emit("chat-actualizado", chatHistory);

  //Aquí escucho cuando alguien agrega un producto, y, si se agregó, envío el mensaje a todas las terminales conectadas con la nueva lista actualizada
  socket.on("agregar-producto", (productoPorAgregar) => {
    const productAdded = productos.save(productoPorAgregar);
    productAdded
      ? io.sockets.emit("lista-productos-actualizada", productos.getAll())
      : socket.emit("agregar-producto-error", {
          mensaje: "Error al intentar agregar el producto",
        });
  });

  socket.on("chat", (newMessage) => {
    //Le agrego la fecha y hora al mensaje
    newMessage.fechaHora = moment().format("YYYY/MM/D hh:mm:ss");

    let chat = getChat();
    chat.push(newMessage);
    fs.writeFileSync("chat.json", JSON.stringify(chat));
    io.sockets.emit("chat-actualizado", chat);
  });
});

function getChat() {
  let chat;
  try {
    chat = fs.readFileSync("chat.json", "utf-8");
  } catch (err) {
    console.log("Hubo un error al intentar leer el chat en readChat(): " + err);
  }
  if (chat && chat != "[]") {
    console.log("Entré aquí");
    chat = JSON.parse(chat);
  } else {
    chat = [];
    console.log("chat vacío!");
  }
  return chat;
}

/*-------------------- ROUTER API--------------- */

router.get("/", (request, response) => {
  const { query } = request;
  //Chequeo si hay algo en el query
  if (Object.keys(query).length === 0) {
    response.json(productos.getAll());
  }
});

router.get("/:id", (request, response) => {
  const { id } = request.params;
  const productList = productos.getAll();
  const productFound = productList.find((element) => element.id == id);
  productFound
    ? response.json(productFound)
    : response.json(
        `El producto con ID ${id}, no se encuentra en nuestra lista de productos`
      );
});

router.post("/", (request, response) => {
  const { body } = request;
  const productAdded = productos.save(body);
  productAdded
    ? response.json({
        success: "ok",
        newProduct: productos.getById(productAdded),
      })
    : response.json("Error, el producto no pudo ser agregado");
});

router.put("/:id", (request, response) => {
  const { id } = request.params;
  const productToModify = productos.getById(id);
  productToModify.price += 1;
  response.json({
    success: "ok",
    message: "El precio del producto fue incrementado en $1 exitosamente",
  });
});

router.delete("/:id", (request, response) => {
  const { id } = request.params;
  const productDeleted = productos.deleteById(id);
  productDeleted
    ? response.json({ success: "ok" })
    : response.json("El producto no se encuentra en nuestra base de datos");
});

/*-----------FIN ROUTER API-----------------*/
