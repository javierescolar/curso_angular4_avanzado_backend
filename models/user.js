'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String
});

module.exports = mongoose.model('User', user_schema);
