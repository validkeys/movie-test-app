import prompts from "prompts";
import { init as setupDatabase, sequelize as db } from "./db"; // renamed init to make code easier to understand
// ^ importing "named exports" from db.js

const internals = {}

export const handlers = {

  _sample: async function(movieName) {
    if (!movieName) {
      throw new Error("name is required")
    }
    return `${movieName} Movie`
  },

  _sample2: async function() {
    const movieName = await prompts({
      type: "text",
      name: "value",
      message: "What's the name of the movie?"
    });

    const { value } = movieName;
    return value.value
  },

  add: async function() {
    const movieName = await prompts({
      type: "text",
      name: "value",
      message: "What's the name of the movie?"
    });

    const { value } = movieName;

    let newMovie = await db.models.movie.create({
      title: value
    });

    console.log(`Movie Created: id#${newMovie.id}`);

    // call start again to keep the good times rolling
    return start();
  },

  list: async function() {
    const movies = await db.models.movie.findAll({
      where: {},
      raw: true
    });

    console.log(`you have ${movies.length} movies in the database`);
    console.log(JSON.stringify(movies, null, 2));
    return start();
  },

  update: async function() {
    const movieToUpdate = await prompts({
      type: "text",
      name: "value1",
      message: "What movie would you like to update?" // change this to a list that the user can select from
    });

    const { value1 } = movieToUpdate;

    const updatedMovie = await prompts({
      type: "text",
      name: "value2",
      message: "What would you like to update it to?"
    });

    const { value2 } = updatedMovie;

    let updateMovie = await db.models.movie.update({
      title: value2
      }, {
        where: {
          title: value1
        }
    });

    const movies = await db.models.movie.findAll({
      where: {},
      raw: true
    });

    console.log(`here is your updated list: `);
    console.log(JSON.stringify(movies, null, 2));
    return start();
  },

  delete: async function() {
    const movieToDelete = await prompts({
      type: "text",
      name: "value",
      message: "What movie would you like to delete?" // change this to a list the user can select from
    });

    const { value } = movieToDelete;

    let deleteMovie = await db.models.movie.destroy({
      where: { 
        title: value 
      }
    });

    const movies = await db.models.movie.findAll({
      where: {},
      raw: true
    });

    console.log(`here is your updated list: `);
    console.log(JSON.stringify(movies, null, 2));
    return start();
  }, 

  view: async function() {
    const movieToView = await prompts({
      type: "text",
      name: "value",
      message: "What movie would you like to view?"
    });

    const { value } = movieToView;

    const movieView = await db.models.movie.findOne({
      where: { 
        title: value 
      },
      raw: true
    });

    console.log(JSON.stringify(movieView, null, 2));
    return start();
  }
};

const start = async function() {
  try {
    await setupDatabase();

    // https://www.npmjs.com/package/prompts#-types
    const response = await prompts({
      type: "select",
      name: "value",
      message: "What would you like to do?",
      choices: [
        { title: "Add a movie", value: "add" },
        { title: "List movies", value: "list" },
        { title: "Update a movie", value: "update" },
        { title: "Delete a movie", value: "delete" },
        { title: "View a movie", value: "view" }
      ]
    });

    const { value } = response;
    const handler = handlers[value];

    if (!handler) {
      throw new Error(`no handler for action: ${value}`);
    }

    return handler();
  } catch (error) {
    console.log("error", error);
  }
};

start(); // start is linked with async and await 

// promises --> asynchronous --> makes the request , continues doing other things , returns results once complete
  // chaining promises 

// callback --> synchronous --> end up with a bunch of nested callbacks --> have to wait until result is returned