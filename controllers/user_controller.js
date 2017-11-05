'use strict'
//modulos
const bcrypt = require('bcrypt-nodejs');
//modelos
const User = require('../models/user');

//acciones
function pruebas(req,res){
  res.status(200).send({
    message:'proband el controlador de usuarios y la accion pruebas'
  });
}

function saveUser(req,res) {
  //crear el objeto del usuario
  var user = new User();

  //obtener los parametros de lapeticion
  var params = req.body;

  console.log(params);
  //asignamos los valores al usuario Object
  if(params.password && params.name
     && params.surname && params.email
    ){
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email;
      user.role = 'ROLE_USER';
      User.findOne({email: user.email.toLowerCase()}, function(err,user_in_db){
        if(err){
          res.status(500).send({message:'Error al comprobar el usuario'});
        } else {
          if(!user_in_db){
            //cifrar contraseña
            bcrypt.hash(params.password,null,null,(err,hash) => {
              user.password = hash;
              //guardo usuario en BBDD
              user.save((err,userStore) => {
                if(err){
                  res.status(500).send({message:'Error al guardar el usuario'});
                } else {
                  if(!userStore){
                    res.status(404).send({message:'No se ha registrado el usuairo'});
                  } else {
                    res.status(200).send({message:'Usuario guardado'});
                  }
                }
              });
            });
          } else {
            res.status(200).send({message:'Usuario ya existe en BBDD'});
          }
        }
      })

  } else {
    res.status(200).send({
      message:'Introduce los datos correctamente'
    });
  }


}

module.exports = {
  pruebas,
  saveUser
};
