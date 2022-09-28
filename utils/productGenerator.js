const { faker } = require("@faker-js/faker");
const idGenerator = require("./idGenerator.js");
faker.locale = "es";

function productGenerator(quantity = 5) {
  let products = [];
  for (let i = 0; i < quantity; i++) {
    let product = {
      id: idGenerator(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(0, 100, 0),
      description: faker.commerce.productDescription(),
      thumbnail: faker.image.fashion(),
    };
    products.push(product);
  }
  return products;
}

module.exports = productGenerator;
