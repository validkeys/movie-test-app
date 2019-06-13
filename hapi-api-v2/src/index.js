import Hapi from "@hapi/hapi"

import { init as setupDatabase, sequelize as db } from "./db"; 

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

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    // ADD --> POST + /movies path + req.payload (specified via Body in Postman)
    server.route({
        method: "POST",
        path: "/movies", 
        handler: async function(req, h) {
            const { movie } = req.payload;

            await db.models.movie.create(movie);

            const movies = await Internals.fetchAllMovies();
            return JSON.stringify(movies);
        }
    });

    // LIST --> GET + /movies path
    server.route({
        method: "GET",
        path: "/movies", 
        handler: async function(req, h) {
            const movies = await Internals.fetchAllMovies();
            return JSON.stringify(movies);
        }
    });

    // VIEW --> GET + /movies/movieId path
    server.route({
        method: "GET",
        path: "/movies/{movieId}", 
        handler: async function(req, h) {
            const { movieId } = req.params;

            const movie = await Internals.fetchMovie(movieId);
            return JSON.stringify(movie);
        }
    });

    // UPDATE --> PUT + /movies/movieId path + req.payload (specified via Body in Postman)
    server.route({
        method: "PUT",
        path: "/movies/{movieId}", 
        handler: async function(req, h) {
            const { movieId } = req.params;

            await db.models.movie.update({
                title: req.payload.movie.title
                }, {
                  where: {
                    id: Number(movieId)
                  }
              });

            const movie = await Internals.fetchMovie(movieId);
            return JSON.stringify(movie);
        }
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

            const movies = await Internals.fetchAllMovies();
            return JSON.stringify(movies);
        }
    });
    
    await setupDatabase();
    console.log("local db has been set up");
    
    await server.start();
    console.log(`Server started running at: ${server.info.uri}`);
};

init();