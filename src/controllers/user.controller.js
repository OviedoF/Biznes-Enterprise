const path = require('path');
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const MemberInvitation = require(path.join(__dirname, '..', 'models', 'memberInvitation.model'));
require('dotenv').config();
const {deleteReqImages, deleteImage} = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const jwt = require('jsonwebtoken');

const userController = {};

userController.register = async (req, res) => {
    try {
        const {enterpriseId} = req.params;
        const body = req.body;

        const enterprise = await Enterprise.findById(enterpriseId).deepPopulate('members');

        if (!enterprise) {
            return res.status(404).send({
                status: false,
                message: 'No se ha encontrado una empresa a la que asociar el usuario.'
            });
        };

        const userFinded = await User.findOne({email: body.email});

        if (userFinded) {
            deleteReqImages(req);
            return res.status(401).send({
                status: false,
                message: 'Ya existe un usuario con ese email.'
            });
        };

        if(req.files.userImage) {
            const {filename} = req.files.userImage[0];
            body.userImage = `${process.env.ROOT_URL}/images/${filename}`;
        }

        const newPassword = await User.encryptPassword(body.password);

        body.password = newPassword;
        body.enterprise = enterpriseId;

        const isValid = await MemberInvitation.findOne({email: body.email, enterprise: enterpriseId, active: true});

        if (!isValid) {
            return res.status(401).send({
                status: false,
                message: 'No tienes permiso de unirte a esta empresa, revisa que tu mail sea el correcto. Si no lo es, solicita una invitación.'
            });
        };

        const user = new User(body);
        await user.save();

        await MemberInvitation.findByIdAndUpdate(isValid._id, {active: false});
        await Enterprise.findByIdAndUpdate(enterpriseId, {$push: {members: user._id}});

        const token = jwt.sign({id: user._id}, process.env.SECRET_JWT_USER, {
            expiresIn: 60 * 60 * 24
        });

        res.status(200).send({
            status: true,
            message: 'Usuario registrado correctamente.',
            data: {
                token,
                user: user._doc
            }
        });
    } catch (error) {
        deleteReqImages(req);
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

userController.updateUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const body = req.body;

        if(body.email) {
            return res.status(401).send({
                status: false,
                message: 'No puedes cambiar tu email.'
            });
        }
        const user = await User.findById(userId);

        if(req.files.userImage && user.userImage.split('/images/')[1]) {
            const {filename} = req.files.userImage[0];
            body.userImage = `${process.env.ROOT_URL}/images/${filename}`;

            const oldImageName = user.userImage.split('/images/')[1];
            const oldImagePath = path.join(__dirname, '..', 'public', 'images', oldImageName);
            deleteImage(oldImagePath);
        }

        const updated = await User.findByIdAndUpdate(userId, body, {new: true});

        res.status(200).send({
            status: true,
            message: 'Usuario actualizado correctamente.',
            data: updated._doc
        });
    } catch (error) {
        console.log(error);
        deleteReqImages(req);
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};  

userController.getUsersByEnterprise = async (req, res) => {
    try {
        const {enterpriseId} = req.params;

        const users = await User.find({enterprise: enterpriseId});

        res.status(200).send({
            status: true,
            message: 'Usuarios obtenidos correctamente.',
            data: users
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

userController.changePermission = async (req, res) => {
    try {
        const {userId} = req.params;

        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
}; 

module.exports = userController;