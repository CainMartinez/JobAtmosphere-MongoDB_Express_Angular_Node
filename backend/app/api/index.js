const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

// create express app
const app = express();
dotenv.config();

// Habilita CORS para todas las rutas
app.use(cors("http://localhost:4200"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('../config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
   // useNewUrlParser: true,
   // useUnifiedTopology: true
}).then(() => {
   console.log("Successfully connected to the database");
}).catch(err => {
   console.log('Could not connect to the database. Exiting now...', err);
   process.exit();
});

// Ruta de prueba
app.get('/', (req, res) => {
   res.send('¡Está vivo!! Hola Mundo');
});

// Registrar rutas
app.use(require('../routes/user.routes.js'));
require('../routes/category.routes')(app);
require('../routes/job.routes.js')(app);
require('../routes/carousel.routes')(app);
app.use('/profiles', require('../routes/profile.routes.js'));
app.use(require('../routes/token.routes.js'));
// require('../routes/comment.routes')(app);

app.listen(process.env.PORT, () => {
   console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});