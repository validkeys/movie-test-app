import Sequelize from "sequelize"

const sequelize = new Sequelize('movies', 'brody', '', { // creates new instance of db
  dialect: "sqlite",
  storage: "./db.sqlite", // stores db locally
  logging: console.log // this shows a log of sql statements
})


class Movie extends Sequelize.Model {} // creates sql model for a movie object

Movie.init({
  title: Sequelize.STRING
}, { sequelize, modelName: "movie" })

export const init = async () => {	// exporting init to connect to the db and update it
  await sequelize.sync()
}

export { sequelize }	// exporting the db itself 