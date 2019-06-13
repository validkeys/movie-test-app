import Sequelize from "sequelize"

// Sequelize constructor takes four arguments: database, username, password, options
const sequelize = new Sequelize('movies', 'brody', '', { 
  dialect: "sqlite",
  storage: "./db.sqlite", // stores db locally
  logging: console.log // shows a log of sql statements when script is run
})

class Movie extends Sequelize.Model {} // creates child class of the Sequelize.Model class

// doc on model definition: http://docs.sequelizejs.com/manual/models-definition.html

Movie.init({
  title: Sequelize.STRING // can add more columns here
}, { sequelize, modelName: "movie" })

export const init = async () => {	// exporting init to be used from index.js to connect to the db and update it
  await sequelize.sync()
}

export { sequelize }	// exporting the db to be accessed from index.js

// the export keyword is used so that these features can be imported to index.js