const path = require('path');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'public', 'images'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
}) // Configurar lugar de almacenaje y nombre del archivo

const config = multer({
    storage: storage,
    dest: path.join(__dirname, 'public', 'images'),
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|webp|jfif|JPG|JPEG|PNG|GIF|WEBP|JFIF|xls|XLS|xlsx|XLSX|/; // Tipos de imágenes permitidas
        const mimeType = fileTypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel';
        const extName = fileTypes.test(path.extname(file.originalname)) || path.extname(file.originalname) === '.xlsx' || path.extname(file.originalname) === '.xls'; // Comprobar extensión del archivo

        if (mimeType && extName){
            return cb(null, true); // Creación exitosa (error = null);
        } else {
            return cb('Error: El archivo debe ser una imágen válida'); // Fallo por tipo de imágen.
        }
    }
}).fields([
    {name: 'images', maxCount: 999},
    {name: 'coverImage', maxCount: 1},
    {name: 'userImage', maxCount: 1},
    {name: 'logo', maxCount: 1},
    {name: 'excel', maxCount: 1}
]); // la consulta va a responder a la key "images" en la petición.

module.exports = config;