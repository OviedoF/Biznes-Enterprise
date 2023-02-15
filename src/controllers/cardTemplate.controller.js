const path = require('path');
const { deleteReqImages, deleteImage } = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CardTemplate= require(path.join(__dirname, '..', 'models', 'cardTemplate.model'));
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const Membership = require(path.join(__dirname, '..', 'models', 'membership.model'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));

const cardTemplateController = {};



module.exports = cardTemplateController;