'use strict'
const express = require('express');
const AnimalController = require('../controllers/animal_controller');

var api = express.Router();

const middlewareAuth = require('../middlewares/authenticate');
const multiparty = require('connect-multiparty');
var middlewareUpload = multiparty({uploadDir: './uploads/animals'});


//rutas
api.get('/pruebas-animales', middlewareAuth.ensureAuth,AnimalController.pruebas);
api.post('/animal', middlewareAuth.ensureAuth,AnimalController.saveAnimal);
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);


module.exports = api;
