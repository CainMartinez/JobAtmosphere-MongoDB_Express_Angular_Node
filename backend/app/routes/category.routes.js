module.exports = (app) => {
        const categories = require('../controllers/category.controller');

        // create a new category
        app.post('/categories', categories.create);

        // get all categories
        app.get('/categories', categories.findAll);

        // get one category
        app.get('/categories/:slug', categories.findOne);

        // delete one category
        app.delete('/categories/:slug', categories.delete_category);

        // Retrieve all Notes
        app.get('/categories_select_filter', categories.findCategoriesSelect);
}