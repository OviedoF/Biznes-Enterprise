const fs = require('fs-extra');
const path = require('path');

const deleteImage = (dirname) => {
    fs.unlink(dirname, (err) => {
        if (err) {
          console.error(err);
          console.error('No se ha podido eliminar el archivo del servidor.');
          return
        };
      
        console.log('Archivo eliminado del servidor.');
    })
};

const deleteReqImages = (req) => {
  if(req.files) {
    const keys = Object.keys(req.files);
    keys.forEach(key => {
      req.files[key].forEach(file => {
        const filename = file.filename;
        const dirname = path.join(__dirname, '..', 'public', 'images', filename);
        deleteImage(dirname);
      })
    })
  }
};

module.exports = {
  deleteImage,
  deleteReqImages
};