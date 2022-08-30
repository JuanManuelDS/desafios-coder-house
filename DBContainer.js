class DBContainer {
  constructor(options, table) {
    this.knex = require("knex")(options);
    this.table = table;
  }

  getAll() {
    let data = this.knex(this.table)
      .select("*")
      .then((response) => response)
      .catch((err) => console.log(err));

    return data;
  }

  save(object) {
    let saved = this.knex(this.table)
      .insert(object)
      .then((res) => res)
      .catch((err) => console.log(err));

    return saved;
  }

  getById(id) {
    let data = this.knex(this.table)
      .where("id", id)
      .then((res) => res)
      .catch((err) => console.log(err));

    return data;
  }

  deleteById(id) {
    let deleted = this.knex(this.table)
      .where("id", id)
      .then((res) => res)
      .catch((err) => console.log(err));

    return deleted;
  }

  deleteAll() {
    let deleted = this.knex(this.table)
      .del()
      .then((res) => res)
      .catch((err) => console.log(err));

    return deleted;
  }
}

module.exports = DBContainer;
