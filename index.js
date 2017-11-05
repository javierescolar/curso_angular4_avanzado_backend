'use strict'
const mongoose = require('mongoose');
const app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo',{useMongoClient:true})
  .then(() => {
       console.log("La conexión a la BD zoo se ha realizado!");
       app.listen(port, () => {
         console.log("servidor local con node y express está corriendo en el puerto: "+port);
       });
   }).catch(err => console.log(err));
