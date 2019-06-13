import Hapi from "@hapi/hapi"

import { init as setupDatabase, sequelize as db } from "./db"; 

/*
const Internals = {
    fetchAllMovies: function() {
      return db.models.movie.findAll({ 
          attributes: ['id', 'title'],
          where: {},
          raw: true
        });
    },
    fetchMovie: function(movieId) {
        return db.models.movie.findOne({
            where: {
              id: Number(movieId)
            }
        });
    }
};
*/

const Internals = {
    fetchAllMovies: function() {
        const movies = db.models.movie.findAll({ 
          attributes: ['id', 'title'],
          where: {},
          raw: true
        });

        return JSON.stringify(movies);
    },
    fetchMovie: function(movieId) {
        const movie = db.models.movie.findOne({
            where: {
              id: Number(movieId)
            }
        });

        return JSON.stringify(movie);
    }
};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // DELETE --> DELETE + /movies/movieId path (???)

    server.route({
        method: "DELETE",
        path: "/movies/{movieId}", 
        handler: async function(req, h) {
            const { movieId } = req.params;

            await db.models.movie.destroy({
                where: { 
                  id: Number(movieId) 
                }
              });

            response = await Internals.fetchAllMovies();
            return response;
        }
    });

    await setupDatabase();
    console.log("local db has been set up");
    
    await server.start();
    console.log(`Server started running at: ${server.info.uri}`);
};

init();