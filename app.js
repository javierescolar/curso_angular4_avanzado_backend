'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//cargar rutas
var user_routes = require('./routes/user_routes');
var animal_routes = require('./routes/animal_routes');

//middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors

//configurar rutas body-parser

//rutas base
app.use('/api',user_routes);
app.use('/api',animal_routes);

module.exports = app;
