module.exports = (app) => {
    const carousel = require('../controllers/carousel.controller');
    app.get('/carousel', carousel.get_carousel_category);
    app.get('/carousel/:slug', carousel.get_carousel_job);

}
