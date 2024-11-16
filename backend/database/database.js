class Database {
  get sequelize() {
    return this.sequelize
  }

  set sequelize(sequelize) {
    if (this.sequelize) throw new Error("Database is already set")
    this.sequelize = sequelize
  }
}

exports = new Database();