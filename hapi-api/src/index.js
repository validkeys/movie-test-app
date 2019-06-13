
const Hapi = require("@hapi/hapi"); // same as import from syntax

const _ = require('lodash');

const { uniqueId } = _; // destructing --> assigning lodash method to uniqueId

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    // proxy db, will swap out for legit db in v2
    const db = [
        { id: 0, title: "Interstellar" },
        { id: 1, title: "Reservoir Dogs" }
    ]; 

    // READ --> GET + movies/movieId path
    server.route({
        method: "GET",
        path: "/movies/{movieId}", // this is how hapi identifies url parameters
        handler: function(req, h) {
            const movie = db.find(m => Number(m.id) === Number(req.params.movieId) );
            return { movie };
        }
    });

    // CREATE --> POST + movies path + req.payload (specified via Body in Postman)
    server.route({
        method: "POST",
        path: "/movies", 
        handler: function(req, h) {
            const { movie } = req.payload;

            const newMovie = {
                id: uniqueId(),
                ...movie 
            };

            db.push(newMovie);

            return {
                movie: newMovie
            };
        }
    });

    // UPDATE --> PUT + movies/movieId path + req.payload (specified via Body in Postman)
    server.route({
        method: "PUT",
        path: "/movies/{movieId}", 
        handler: function(req, h) {

            const indexToUpdate = db.indexOf(...db.filter(a => Number(a.id) === Number(req.params.movieId)));
            
            db[indexToUpdate].title = req.payload.movie.title

            return db[indexToUpdate];
        }
    });

    // DELETE --> DELETE + movies/movieId path (???)

    server.route({
        method: "DELETE",
        path: "/movies/{movieId}", 
        handler: function(req, h) {

            const indexToDelete = db.indexOf(...db.filter(a => Number(a.id) === Number(req.params.movieId)));
            
            db.splice(indexToDelete, 1); 

            return db;
        }
    });

    await server.start();
    console.log(`Sever started running at: ${server.info.uri}`);

};

init();