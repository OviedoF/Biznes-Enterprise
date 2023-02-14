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

        userToSend = await User.findOne({email}).deepPopulate(['enterprise.members']);
        let userType = 'user';

        if (!userToSend) {
            userToSend = await Enterprise.findOne({ email: email });
            userType = 'enterprise';
            console.log(userToSend)

            if (!userToSend) {
                return res.status(404).json({
                    message: 'No se ha encontrado un usuario con ese email.'
                });
            };

            const isMatch = await Enterprise.comparePassword(password, userToSend.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: 'La contraseña es incorrecta.'
                });
            };
        };

        console.log(userToSend)

        if(userType !== 'enterprise') {
            const isMatch = await User.comparePassword(password, userToSend.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: 'La contraseña es incorrecta.'
                });
            }
        }

        const token = jwt.sign({ id: userToSend._id }, process.env.SECRET_JWT_USER, {
            expiresIn: 86400
        });

        res.json({ token,  userType, userToSend });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = authController;