const productGenerator = require("../utils/productGenerator");

function getProductosTest(req, res) {
  let productos = productGenerator();
  res.status(200);
  res.json(productos);
}

module.exports = { getProductosTest };
