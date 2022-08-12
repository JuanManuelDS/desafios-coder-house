const Contenedor = require("./contenedor");
const express = require("express");

const { Router } = express;
const app = express();
const router = Router();
const PORT = 8080;
const server = app.listen(PORT);
let productos = new Contenedor();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);
app.use("public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//Aquí estoy seteando que cuando entren a localhost.com/ les devuelva index.html
app.get("/", (request, response) => {
  response.render("pages/productList", { productos: productos.getAll() });
});

app.get("/productos", (request, response) => {
  response.render("pages/form", { productos: productos.getAll() });
});

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
