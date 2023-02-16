const path = require('path');
const fs = require('fs');
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const Membership = require(path.join(__dirname, '..', 'models', 'membership.model'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const {deleteReqImages, deleteImage} = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {};

authController.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        let userToSend = null;

        userToSend = await User.findOne({email}).deepPopulate('enterprise.members', 'membership');
        let userType = 'user';

        if (!userToSend) {
            userToSend = await Enterprise.findOne({ email: email }).deepPopulate(['members', 'membership', 'roles']);
            userType = 'enterprise';

            if (!userToSend) {
                return res.status(404).json({
                    status: false,
                    message: 'No se ha encontrado un usuario con ese email.'
                });
            };

            const isMatch = await Enterprise.comparePassword(password, userToSend.password);

            if (!isMatch) {
                return res.status(401).json({
                    status: false,
                    message: 'La contraseña es incorrecta.'
                });
            };
        };

        if(userType !== 'enterprise') {
            const isMatch = await User.comparePassword(password, userToSend.password);

            if (!isMatch) {
                return res.status(401).json({
                    status: false,
                    message: 'La contraseña es incorrecta.'
                });
            }
        }

        const token = jwt.sign({ id: userToSend._id }, process.env.SECRET_JWT_USER, {
            expiresIn: 86400
        });

        res.status(200).send({
            status: true,
            message: 'Usuario logueado correctamente.',
            data: { token,  userType, userToSend: {
                ...userToSend._doc,
                password: null
            }}
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

module.exports = authController;