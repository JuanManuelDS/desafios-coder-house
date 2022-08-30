const DBContainer = require("./DBContainer");
const { options: SQLite } = require("./options/sqlite");
const { options: MySQL } = require("./options/MySQL");
const chatDB = new DBContainer(SQLite, "messages");
const productsDB = new DBContainer(MySQL, "products");
const express = require("express");
const app = express();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const { Router } = express;
const router = Router();

httpServer.listen(process.env.PORT || 8080);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);

//Aquí estoy seteando que cuando entren a localhost.com/ les devuelva index.html
app.get("/", (request, response) => {
  response.sendFile("index.html", { root: __dirname });
});

io.on("connection", async (socket) => {
  //Aquí envío la tabla de productos al momento en que un cliente se conecta
  let products = await productsDB.getAll();
  let messages = await chatDB.getAll();

  socket.emit("lista-productos-actualizada", products);
  socket.emit("chat-actualizado", messages);

  //Aquí escucho cuando alguien agrega un producto, y, si se agregó, envío el mensaje a todas las terminales conectadas con la nueva lista actualizada
  socket.on("agregar-producto", async (productoPorAgregar) => {
    const productAdded = await productsDB.save(productoPorAgregar);
    let newProductsList = await productsDB.getAll();

    productAdded
      ? io.sockets.emit("lista-productos-actualizada", newProductsList)
      : socket.emit("agregar-producto-error", {
          mensaje: "Error al intentar agregar el producto",
        });
  });

  socket.on("chat", async (newMessage) => {
    let addMessage = await chatDB.save(newMessage);
    let updatedChat = await chatDB.getAll();
    if (addMessage) {
      io.sockets.emit("chat-actualizado", updatedChat);
    } else {
      console.log("Ha ocurrido un problema al agregar el mensaje al chat");
    }
  });
});
