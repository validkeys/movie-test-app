import Sequelize from "sequelize"

const sequelize = new Sequelize('movies', 'brody', '', {
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: console.log
})

class Movie extends Sequelize.Model {}

Movie.init({
  title: Sequelize.STRING
}, { sequelize, modelName: "movie" })

export const init = async () => {
  await sequelize.sync()
}

export { sequelize }