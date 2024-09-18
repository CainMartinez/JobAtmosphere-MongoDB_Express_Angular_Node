module.exports = (app) => {

    const jobs = require('../controllers/job.controller.js');
    // const verifyJWT = require('../middleware/verifyJWT');
    // const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

    // create a new job
    app.post('/jobs', jobs.createJob);

    //GET ALL
    app.get('/jobs', jobs.findAllJob);
    // app.get('/jobs', verifyJWTOptional, jobs.findAllJob);

    //GET ONE
    app.get('/jobs/:slug', jobs.findOneJob);
    // app.get('/jobs/:slug', verifyJWTOptional, jobs.findOneJob);

    // Delete a Note with noteId
    app.delete('/jobs/:slug', jobs.deleteOneJob);

    //get jobs by category
    app.get('/categories/:slug', jobs.GetjobsByCategory);
    // app.get('/categories/:slug', verifyJWTOptional, jobs.GetjobsByCategory);

    //Favorite
    // app.post('/:slug/favorite', verifyJWT, jobs.favouriteJob);

    //Unfavorite
    // app.delete('/:slug/favorite', verifyJWT, jobs.unfavoriteJob);

    //Update
    app.put('/jobs/:slug', jobs.updateJob);
    // app.put('/jobs/:slug', verifyJWT, jobs.updateJob);
}