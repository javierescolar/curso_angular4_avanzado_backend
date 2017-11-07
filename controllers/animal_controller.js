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
        res.status(200).send({
          message:'animal encontrado',
          animal: animal
        });
      }
    }
  });
}

function updateAnimal(req,res) {
  var animalId = req.params.id;
  var update = req.body;

  Animal.findByIdAndUpdate(animalId,update,{new:true},(err, animalUpdated) => {
    if (err) {
      res.status(500).send({message:'Error en la petición'});
    } else {
      if (!animalUpdated) {
        res.status(404).send({message:'No se ha updateado el animal'});
      } else {
        res.status(200).send({
          message:'animal modificado',
          animal: animalUpdated
        });
      }
    }
  });
}

function uploadImage(req,res){
  var animalId = req.params.id;
  var file_name = "No subido...";

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpg'
      || file_ext == 'jpeg' || file_ext == 'gif'){


      Animal.findByIdAndUpdate(animalId,{image: file_name},{new:true},(err, animalUpdated)=> {
        if(err){
          res.status(500).send({
            message: 'Error al updatear imagen del animal'
          });
        } else {
          res.status(200).send({
            message: 'animal actualizado con la imagen',
            animal:animalUpdated, image:file_name
          });
        }
      });


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

function deleteAnimal(req,res){
  var animalId = req.params.id;

  Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{
    if (err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if (!animalRemoved) {
        res.status(404).send({
          message: 'No se ha podido borrar el animal'
        });
      } else {
        res.status(200).send({
          message: 'Animal eliminado',
          animalRemoved
        });
      }
    }
  });
}


module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal
}
