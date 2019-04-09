import prompts from "prompts";
import { init as setupDatabase, sequelize as db } from "./db";

const handlers = {
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

start();
