'use strict'
//modulos
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');
//modelos
const User = require('../models/user');

const path_files_uploads = './uploads/users/';
//servicio JWT
var jwt = require('../services/jwt');
//acciones
function pruebas(req,res){
  res.status(200).send({
    message:'probando el controlador de usuarios y la accion pruebas',
    user: req.user
  });
}

function saveUser(req,res) {
  //crear el objeto del usuario
  var user = new User();

  //obtener los parametros de lapeticion
  var params = req.body;

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
                    res.status(200).send({
                      message:'Usuario guardado',
                      user: userStore
                    });
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

function login(req,res) {
  var params = req.body;
  User.findOne({email: params.email.toLowerCase()}, function(err,user){
    if(err){
      res.status(500).send({message:'Error al comprobar el usuario'});
    } else {
      if(!user){
        res.status(404).send({
          message:'usuario no se ha podido logear'
        });
      } else {
        bcrypt.compare(params.password, user.password, (err,check) => {
          if(check) {
            //comprobar y generar token
            if(params.gettoken){
              //devolver el token
              res.status(200).send({
                token: jwt.CreateToken(user)
              })
            } else {
              res.status(200).send({user:user});
            }
          } else {
            res.status(404).send({
              message:'usuario no se ha podido logearse correctamente'
            });
          }
        });
      }
    }
  });
}

function updateUser(req,res) {

  var userId = req.params.id;
  var update = req.body;
  delete update.password;
  if (userId != req.user.sub) {
    return res.status(500).send({
      message: 'No tienes permiso para actualizar el usuario'
    });
  } else {
    User.findByIdAndUpdate(userId,update,(err, userUpdated)=> {
      if(err){
        res.status(500).send({
          message: 'Error al actualizar usuario'
        });
      } else {
        res.status(200).send({
          message: 'usuario actualizado',
          user:userUpdated
        });
      }
    });
  }
}

function uploadImage(req,res){
  var userId = req.params.id;
  var file_name = "No subido...";

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpg'
      || file_ext == 'jpeg' || file_ext == 'gif'){

        if (userId != req.user.sub) {
          return res.status(500).send({
            message: 'No tienes permiso para actualizar la imagen del usuario'
          });
        } else {
          User.findByIdAndUpdate(userId,{image: file_name},{new:true},(err, userUpdated)=> {
            if(err){
              res.status(500).send({
                message: 'Error al updatear imagen del usuario'
              });
            } else {
              res.status(200).send({
                message: 'usuario actualizado con la imagen',
                user:userUpdated
              });
            }
          });
        }

    } else {
      fs.unlink(file_path,(err)=>{
        if(err){
          res.status(200).send({
            message: 'Extensión no válida y fichero no guardado'
          });
        } else {
          res.status(200).send({
            message: 'Extensión no válida'
          });
        }
      });
    }
  } else {
    res.status(200).send({
      message: 'No se han subido ficheros'
    });
  }
}


function getImageFile(req,res){
  var imageFile = req.params.imageFile;
  var path_file = path_files_uploads + imageFile;

  fs.exists(path_file, (exists) => {
    if(exists){
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(404).send({
        message: 'Imagen no existe'
      });
    }
  });
}

function getKeepers(req,res){
  User.find({role: 'ROLE_ADMIN'})
    .exec((err,keepers)=>{
      if (err) {
        res.status(500).send({message: 'Error petición keepers'});
      } else {
        if(!keepers){
          res.status(404).send({message: 'No hay cuidadores'});
        } else {
          res.status(200).send({keepers: keepers});
        }
      }
    });
}

module.exports = {
  pruebas,
  saveUser,
  login,
  updateUser,
  uploadImage,
  getImageFile,
  getKeepers
};
