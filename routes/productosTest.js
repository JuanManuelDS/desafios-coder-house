const express = require("express");
const router = express.Router();
const { getProductosTest } = require("../controllers/productosTest");

router.get("/", getProductosTest);

module.exports = { router };
