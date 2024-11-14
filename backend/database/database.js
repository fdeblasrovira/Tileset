class Database {
  set(sequelize) {
    if (this.sequelize) throw new Error("Database is already set")
    this.sequelize = sequelize
  }

  get() {
    return this.sequelize
  }
}

exports = new Database();