const { router: productosTestRoutes } = require("./routes/productosTest.js");
const express = require("express");
const connectToMongo = require("./config.js");
const ioStarter = require("./io/ioStarter");

const app = express();
const PORT = process.env.PORT || 8080;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

connectToMongo()
  .then(() => {
    httpServer.listen(PORT, () =>
      console.log("Servidor corriendo en puerto " + PORT)
    );
  })
  .then(() => ioStarter(io));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos-test", productosTestRoutes);

//Aquí estoy seteando que cuando entren a localhost.com/ les devuelva index.html
app.get("/", (request, response) => {
  response.sendFile("index.html", { root: __dirname });
});
