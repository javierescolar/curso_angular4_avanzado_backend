'use strict'
const express = require('express');
const UserController = require('../controllers/user_controller');

var api = express.Router();

api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);

module.exports = api;
