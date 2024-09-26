module.exports = (app) => {
        const categories = require('../controllers/category.controller.js');

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

        // Update a Note with noteId
        // app.put('/productos/:id', products.update);

        // Delete todos los mf products
        // app.delete('/productos_all', products.deleteAll);
}