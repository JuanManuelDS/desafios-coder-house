const mongoose = require("mongoose");

const CONNECTION_URL =
  "mongodb+srv://juanma:1234numero@cluster0.6u3ifbw.mongodb.net/?retryWrites=true&w=majority";

async function connectToMongo() {
  await mongoose
    .connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Conexión a la base de datos exitosa"))
    .catch((err) => {
      console.log(
        "Hubo un error al intentar conectarse a la base de datos " + err.message
      );
    });
}

module.exports = connectToMongo;
