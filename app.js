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
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Authorization ,X-API-KEY, Origin, X-REquested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
  next();
});
//configurar rutas body-parser

//rutas base
app.use('/api',user_routes);
app.use('/api',animal_routes);

module.exports = app;
