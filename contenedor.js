const fs = require("fs");

class Contenedor {
  getAll() {
    let data, file;
    try {
      file = fs.readFileSync("data.json", "utf-8");
    } catch (err) {
      console.log(
        "Hubo un error al leer el archivo en la función getAll(): " + err
      );
    }
    if (file) {
      data = JSON.parse(file);
    }
    return file ? data : [];
  }

  save(producto) {
    let listaProductos = this.getAll();
    let listaProductosJSON;

    if (listaProductos.length != 0) {
      let indiceIDs = listaProductos.map((x) => x.id).sort();
      //le asigno el número más alto de los ids existentes + 1
      producto.id = indiceIDs[indiceIDs.length - 1] + 1;
    } else {
      //Si la lista está vacía le asigno id = 0
      producto.id = 0;
    }
    //Agrego el producto a la lista
    listaProductos.push(producto);
    listaProductosJSON = JSON.stringify(listaProductos);
    try {
      fs.writeFileSync("data.json", listaProductosJSON);
    } catch (err) {
      console.log(
        "Hubo un error al intentar reescribir el archivo en save(): " + err
      );
    }
    return producto.id;
  }

  getById(numeroID) {
    let listaProductos = this.getAll();
    let producto;
    listaProductos.forEach((element) => {
      if (element.id == numeroID) producto = element;
    });
    if (producto) {
      return producto;
    } else {
      console.log("No existe un producto con el número de ID: " + numeroID);
    }
  }

  deleteById(numeroID) {
    let listaProductos = this.getAll();
    let indexDelProductoAEliminar;
    listaProductos.forEach((element, ind) => {
      if (element.id == numeroID) indexDelProductoAEliminar = ind;
    });
    //Chequeo que haya coincidencia de ID y que el array tenga más de un elemento para usar splice
    if (indexDelProductoAEliminar != undefined && listaProductos.length > 1) {
      //Creo la nueva lista sin el producto seleccionado
      listaProductos.splice(indexDelProductoAEliminar, 1);
      let nuevaListaProductosJSON = JSON.stringify(listaProductos);
      try {
        fs.writeFileSync("data.json", nuevaListaProductosJSON);
      } catch (err) {
        console.log(
          "Hubo un error al intentar reescribir el archivo en deleteById(): " +
            err
        );
      }
    } else if (
      indexDelProductoAEliminar != undefined &&
      listaProductos.length == 1
    ) {
      this.deleteAll();
    } else {
      console.log(
        `El producto con el ID ${numeroID} no existe en nuestra base de datos`
      );
    }
    return indexDelProductoAEliminar ? true : false;
  }

  deleteAll() {
    fs.writeFileSync("data.json", "");
  }
}

module.exports = Contenedor;
