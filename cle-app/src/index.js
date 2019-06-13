import prompts from "prompts";
// imports index.js from prompts package in node_modules folder (how did we import all these packages again?)

import { init as setupDatabase, sequelize as db } from "./db";  // imported from db.js file

const Internals = {
  fetchAllMovies: function() {
    return db.models.movie.findAll({ 
        attributes: ['id', 'title'],
        where: {},
        raw: true
      });
  },
  printAllMovies: async function() {
    var movies = await Internals.fetchAllMovies()
    console.log(`You have ${movies.length} movies in the database:`);
    console.log(JSON.stringify(movies, null, 2));
  },
  moviesMenu: async function() {
    var movies = await Internals.fetchAllMovies();
    return movies.map(m => {
      return { title: m.title, value: m.id }
    })
  }
};

const handlers = {
  add: async function() {
    const movieTitle = await prompts({
      type: "text",
      name: "movieTitle",
      message: "What's the name of the movie?"
    });

    await db.models.movie.create({
      title: movieTitle.movieTitle
    });

    await Internals.printAllMovies()

    return start();
  },

  list: async function() {

    await Internals.printAllMovies();

    return start();
  },

  update: async function() {

    var movies = await Internals.fetchAllMovies()

    const movieToUpdate = await prompts({
      type: "select",
      name: "movieId",
      message: "What movie would you like to update?",
      choices: await Internals.moviesMenu()
    });

    const updatedMovie = await prompts({
      type: "text",
      name: "movieTitle",
      message: "What would you like to update it to?"
    });

    await db.models.movie.update({
      title: updatedMovie.movieTitle
      }, {
        where: {
          id: movieToUpdate.movieId
        }
    });
    
    await Internals.printAllMovies();
    
    return start();
  },
  
  delete: async function() {
    
    var movies = await Internals.fetchAllMovies()

    const movieToDelete = await prompts({
      type: "select",
      name: "movieId",
      message: "What movie would you like to delete?",
      choices: await Internals.moviesMenu()
    });

    await db.models.movie.destroy({
      where: { 
        id: movieToDelete.movieId 
      }
    });

    await Internals.printAllMovies();

    return start();
  }, 

  view: async function() {

    var movies = await Internals.fetchAllMovies()

    const movieToView = await prompts({
      type: "select",
      name: "movieId",
      message: "What movie would you like to view?",
      choices: await Internals.moviesMenu()
    });

    const movieView = await db.models.movie.findAll({
      where: { 
        id: movieToView.movieId 
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

    const { value } = response; // what is this syntax ??? 
    const handler = handlers[value];

    if (!handler) {
      throw new Error(`no handler for action: ${value}`);
    }

    return handler();
  } catch (error) {
    console.log("error", error);
  }
};

start(); 