const { faker } = require("@faker-js/faker");
faker.locale = "es";

function idGenerator() {
  return faker.datatype.uuid();
}

module.exports = idGenerator;
