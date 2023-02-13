const path = require('path');
const fs = require('fs');
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const Membership = require(path.join(__dirname, '..', 'models', 'membership.model'));
const MemberInvitation = require(path.join(__dirname, '..', 'models', 'memberInvitation.model'));
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {deleteReqImages, deleteImage} = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const nodeMailer = require('nodemailer');

const enterpriseController = {};

enterpriseController.getEnterprises = async (req, res) => {
    try {
        const enterprises = await Enterprise.find();
        res.json(enterprises);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

enterpriseController.getEnterprise = async (req, res) => {
    try {
        const enterprise = await Enterprise.findById(req.params.id).deepPopulate([ 'membership', 'members' ]);

        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada.'
            });
        }

        res.json(enterprise);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

enterpriseController.createEnterprise = async (req, res) => {
    try {
        const body = req.body;
        const basicMembership = await Membership.findOne({ price: 0 });

        body.membership = basicMembership._id;

        if (req.files) {
            const {filename: logoFilename} = req.files.logo[0];
            const {filename: coverFilename} = req.files.coverImage[0];

            const logoPath = `${process.env.ROOT_URL}/images/${logoFilename}`;
            const coverImagePath = `${process.env.ROOT_URL}/images/${coverFilename}`;

            body.logo = logoPath;
            body.coverImage = coverImagePath;
        };

        const newPassword = await Enterprise.encryptPassword(body.password);
        body.password = newPassword;

        const enterprise = new Enterprise(body, {password: false});

        await enterprise.save();

        const token = jwt.sign({ _id: enterprise._id }, process.env.SECRET_JWT_USER, {
            expiresIn: 60 * 60 * 24
        });

        res.json({
            message: 'Enterprise created successfully',
            token,
            enterprise: {
                ...enterprise._doc,
                password: null
            }
        });
    } catch (error) {
        deleteReqImages(req);
        res.status(500).json({
            message: error.message
        });
    }
}

enterpriseController.login = async (req, res) => {
    try {
        /* login */
        
        const { email, password } = req.body;

        const enterprise = await Enterprise.findOne({ email: email });

        if (!enterprise) {
            return res.status(404).json({
                message: 'Email o contraseña incorrecta.'
            });
        }

        const matchPassword = await Enterprise.comparePassword(password, enterprise.password);

        if (!matchPassword) {
            return res.status(401).json({
                message: 'Email o contraseña incorrecta.'
            });
        }

        const token = jwt.sign({ _id: enterprise._id }, process.env.SECRET_JWT_USER, {
            expiresIn: 60 * 60 * 24
        });

        res.json({
            message: 'Enterprise logged in successfully',
            token,
            enterprise
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });       
    }
}

enterpriseController.updateEnterprise = async (req, res) => {
    try {
        const body = req.body;
        const { id } = req.params;

        const enterpriseFinded = await Enterprise.findById(id);

        if (!enterpriseFinded) {
            deleteReqImages(req);
            return res.status(404).json({
                message: 'Empresa no encontrada.'
            });
        }

        console.log(req.files);

        if (req.files) {
            if(req.files.logo && enterpriseFinded.logo.split('/images/')[1]) {
                const oldImageName = enterpriseFinded.logo.split('/images/')[1];
                const oldLogoPath = path.join(__dirname, '..', 'public', 'images', oldImageName);
                deleteImage(oldLogoPath);
                console.log('Imagen antigua de logo eliminada del servidor.');

                const {filename: logoFilename} = req.files.logo[0];
                const logoPath = `${process.env.ROOT_URL}/images/${logoFilename}`;
                body.logo = logoPath;
            }

            if(req.files.coverImage && enterpriseFinded.coverImage.split('/images/')[1]) {
                const oldImageName = enterpriseFinded.coverImage.split('/images/')[1];
                const oldCoverImagePath = path.join(__dirname, '..', 'public', 'images', oldImageName);
                deleteImage(oldCoverImagePath);
                console.log('Imagen antigua de portada eliminada del servidor.');

                const {filename: coverFilename} = req.files.coverImage[0];
                const coverImagePath = `${process.env.ROOT_URL}/images/${coverFilename}`;
                body.coverImage = coverImagePath;
            }
        };

        const updated = await Enterprise.findByIdAndUpdate(id, body, { new: true });

        res.json({
            message: 'Enterprise updated successfully',
            updated,
        });
    } catch (error) {
        deleteReqImages(req);
        res.status(500).json({
            message: error.message
        });
    }
}

enterpriseController.createMemberInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const enterprise = await Enterprise.findById(id);

        if (!enterprise) {
            return res.status(404).json({
                message: 'Empresa no encontrada.'
            });
        }

        const transporter = await nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `Biznes Enterprise <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: 'Invitación a unirse a la empresa',
            html: `
                <h1>Invitación a unirse a la empresa</h1>
                <p>Has sido invitado a unirte a la empresa ${enterprise.name}.</p>
                <p>Para unirte a la empresa, haz click en el siguiente enlace:</p>
                <a href="${process.env.ROOT_URL}/enterprise/join/${enterprise._id}?invitated_mail=${email}">Unirse a la empresa</a>
            `
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Error al enviar el correo.'
                });
            }

            const memberInvitation = new MemberInvitation({
                enterprise: id,
                memberEmail: email
            });

            await memberInvitation.save();

            return res.json({
                message: 'Invitación enviada correctamente.'
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = enterpriseController;