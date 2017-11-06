'use strict'
//modulos
const fs = require('fs');
const path = require('path');
//modelos
const User = require('../models/user');
const Animal = require('../models/animals');

const path_files_uploads = './uploads/animals/';

//acciones
function pruebas(req,res){
  res.status(200).send({
    message:'probando el controlador de animales y la accion pruebas',
    user: req.user
  });
}

function saveAnimal(req,res){
  var animal = new Animal();
  var params = req.body;

  if (params.name) {
    animal.name = params.name;
    animal.description = params.description;
    animal.year = params.year;
    animal.image = null;
    animal.user = req.user.sub;

    animal.save((err, animalStored) => {
      if (err) {
        res.status(500).send({
          message:'Error al guardar Animal'
        });
      } else {
        if (!animalStored) {
          res.status(404).send({
            message:'No se ha guardado el Animal'
          });
        } else {
          res.status(200).send({
            message:'Animal Guardado',
            animal: animalStored
          });
        }
      }
    });
  } else {
    res.status(404).send({
      message:'El nombre es requerido'
    });
  }
}

function getAnimals(req, res) {
  Animal.find({}).populate({path:'user'}).exec((err,animals)=>{
    if (err) {
      res.status(500).send({
        message:'Error en la petición'
      });
    } else {
      if (!animals) {
        res.status(404).send({
          message:'animales no encontrados'
        });
      } else {
        res.status(404).send({
          message:'animales encontrados',
          animals: animals
        });
      }
    }
  });
}

function getAnimal(req, res) {
  var animalId = req.params.id;
  Animal.findById(animalId).populate({path:'user'}).exec((err,animal)=>{
    if (err) {
      res.status(500).send({
        message:'Error en la petición'
      });
    } else {
      if (!animal) {
        res.status(404).send({
          message:'animal no encontrado'
        });
      } else {
        res.status(404).send({
          message:'animal encontrado',
          animal: animal
        });
      }
    }
  });
}



module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal
}
