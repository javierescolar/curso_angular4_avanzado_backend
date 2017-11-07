'use strict'
const express = require('express');
const AnimalController = require('../controllers/animal_controller');

var api = express.Router();

const middlewareAuth = require('../middlewares/authenticate');
const middlewareAdmin = require('../middlewares/is_admin');
const multiparty = require('connect-multiparty');
var middlewareUpload = multiparty({uploadDir: './uploads/animals'});


//rutas
api.get('/pruebas-animales', middlewareAuth.ensureAuth,AnimalController.pruebas);
api.post('/animal', [middlewareAuth.ensureAuth, middlewareAdmin.isAdmin],AnimalController.saveAnimal);
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);
api.put('/animal/:id', [middlewareAuth.ensureAuth, middlewareAdmin.isAdmin], AnimalController.updateAnimal);
api.post('/upload-image-animal/:id', [middlewareAuth.ensureAuth,middlewareAdmin.isAdmin,middlewareUpload],AnimalController.uploadImage);
api.get('/get-image-animal/:imageFile', AnimalController.getImageFile);
api.delete('/animal/:id', [middlewareAuth.ensureAuth, middlewareAdmin.isAdmin], AnimalController.deleteAnimal);


module.exports = api;
