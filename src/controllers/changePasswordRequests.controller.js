const path = require('path');
require('dotenv').config();
const {v4} = require('uuid');
const ChangePasswordRequest = require(path.join(__dirname, '..', 'models', 'verifiers', 'changePasswordRequest.model'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const nodemailer = require('nodemailer');
const LogInEmail = require(path.join(__dirname, '..', 'emails', 'LogIn.js'))

const changePasswordController = {};

changePasswordController.createCode = async (req, res) => {
    try {
        const {email} = req.body;
        const code = v4();
        const abrevCode = code.slice(0, 6);

        let user = false;

        const userFinded = await User.findOne({email});

        if(userFinded) user = userFinded;
        
        if(!userFinded) { 
            user = await Enterprise.findOne({email});
            if(!user) return res.status(404).send({status: false, message: 'No se ha encontrado un usuario con ese email.'});
        }

        const currentRequest = await ChangePasswordRequest.findOne({email: email});
        if(currentRequest) await ChangePasswordRequest.findByIdAndDelete(currentRequest._id);
        
        const newRequest = new ChangePasswordRequest({
            email, 
            code: abrevCode,
            state: 'in process'
        });

        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const messageHtml = LogInEmail("https://res.cloudinary.com/syphhy/image/upload/v1674144822/image-removebg-preview_22_xfa4ss.png", 'Cambio de contraseña', 
        newRequest.code, `Hemos recibido una solicitud de cambio de contraseña para tu usuario de Biznes Empresa. Si crees que este correo es un error, por favor ignóralo. Por el contrario, usa el siguiente código
        en la ventana de <a style="font-size: 20px;" href="${process.env.FRONTEND_URL}">Biznes</a> para poder cambiar tu contraseña con éxito, recuerda distinguir entre mayúsculas y minúsculas. 
        Muchas gracias por confiar en nosotros!
        
        Si no has solicitado este cambio de contraseña o tienes algún problema, no dudes en contactarnos mediante la sección de "ayuda" de la página principal o 
        enviando un correo electrónico a contacto@biznes.cl`, 
        ``, newRequest.code, 
        'de parte de', `${process.env.FRONTEND_URL}`, 'Biznes');

        const emailSended = await transporter.sendMail({
            from: `'Biznes Empresa' <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: 'Biznes Empresa - Solicitud de cambio de contraseña',
            html: messageHtml
        })

        await newRequest.save();

        res.status(201).send({
            status: true,
            message: 'Código enviado con éxito.',
            data: {
                image: user.userImage,
                userId: user._id
            }
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Error inesperado.'
        });
        console.log(error);
    }
};

changePasswordController.verifyCode = async (req, res) => {
    try {
        const {code, email} = req.body;
        const codeVerified = await ChangePasswordRequest.findOne({code, email});

        if(!codeVerified) return res.status(404).send({
            status: false,
            message: 'Código no encontrado o vencido. Por favor, solicita uno nuevo o verifique que el código ingresado sea correcto.'
        });

        await ChangePasswordRequest.findByIdAndDelete(codeVerified._id);
        
        res.status(200).send({
            status: true,
            message: 'Código verificado con éxito.'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error inesperado');
    }
}

changePasswordController.changePassword = async (req, res) => {
    try {
        const {id} = req.params;
        const {newPassword} = req.body;

        const user = await User.findById(id);

        if(user) {
            const password = await User.encryptPassword(newPassword);
            await User.findByIdAndUpdate(id, { password }, {new: true});
        }

        if(!user) {
            const enterprise = await Enterprise.findById(id);
            if(!enterprise) return res.status(404).send('No se ha encontrado un usuario registrado.');

            const password = await Enterprise.encryptPassword(newPassword);
            await Enterprise.findByIdAndUpdate(id, {password}, {new: true});
        }

        res.status(200).send({
            status: true,
            message: 'Contraseña cambiada con éxito.'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = changePasswordController;