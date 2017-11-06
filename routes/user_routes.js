'use strict'
const express = require('express');
const UserController = require('../controllers/user_controller');

var api = express.Router();

const middlewareAuth = require('../middlewares/authenticate');
const multiparty = require('connect-multiparty');
var middlewareUpload = multiparty({uploadDir: './uploads/users'});





api.get('/pruebas', middlewareAuth.ensureAuth,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', middlewareAuth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id', [middlewareAuth.ensureAuth,middlewareUpload],UserController.uploadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);
api.get('/keepers', UserController.getKeepers);

module.exports = api;
