const path = require('path');
const fs = require('fs');
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const EnterpriseRol = require(path.join(__dirname, '..', 'models', 'enterpriseRol.model'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const Membership = require(path.join(__dirname, '..', 'models', 'membership.model'));
const MemberInvitation = require(path.join(__dirname, '..', 'models', 'memberInvitation.model'));
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {deleteReqImages, deleteImage} = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const nodeMailer = require('nodemailer');
const xlsxFile = require('read-excel-file/node');

const enterpriseController = {};

enterpriseController.getEnterprises = async (req, res) => {
    try {
        const enterprises = await Enterprise.find();
        res.status(200).send({
            status: true,
            message: 'Empresas encontradas.',
            data: enterprises
        });
    } catch (error) {
        res.status(500).json({
            status: false,
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

        res.status(200).send({
            status: true,
            message: 'Empresa encontrada.',
            data: enterprise
        });
    } catch (error) {
        res.status(500).json({
            status: false,
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

        const enterprise = new Enterprise(body);

        await enterprise.save();

        const token = jwt.sign({ _id: enterprise._id }, process.env.SECRET_JWT_USER, {
            expiresIn: 60 * 60 * 24
        });

        res.status(200).send({
            status: true,
            message: 'Enterprise created successfully',
            data: {
                token,
                enterprise: {
                    ...enterprise._doc,
                    password: null
                }
            }
        });
    } catch (error) {
        deleteReqImages(req);
        res.status(500).json({
            status: false,
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
            return res.status(404).send({
                status: false,
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

        res.status(200).send({
            status: true,
            message: 'Enterprise updated successfully',
            data: updated,
        });
    } catch (error) {
        deleteReqImages(req);
        res.status(500).json({
            status: false,
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
            return res.status(404).send({
                status: false,
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
                return res.status(500).send({
                    status: false,
                    message: 'Error al enviar el correo.'
                });
            }

            const memberInvitation = new MemberInvitation({
                enterprise: id,
                memberEmail: email
            });

            await memberInvitation.save();

            return res.status(200).send({
                status: true,
                message: 'Invitación enviada correctamente.'
            });
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
}

enterpriseController.readExcelWithMails= async (req, res) => {
    try {
        const { id } = req.params;
        const enterprise = await Enterprise.findById(id);

        if (!enterprise) {
            return res.status(404).send({
                status: false,
                message: 'Empresa no encontrada.'
            });
        };

        // check if the file is an excel file
        const excelExtensions = /\.(xls|XLS|xlsx|XLSX)$/; 

        if (!excelExtensions.test(req.files.excel[0].filename)) {
            return res.status(400).send({
                status: false,
                message: 'El archivo no es un archivo de excel. Verifique la extensión del archivo. (xls, XLS, xlsx, XLSX)'
            });
        }

        const excelPath = req.files.excel[0].path;

        const data = await xlsxFile(excelPath); 

        const emails = data.map(row => row[0]); 

        emails.shift()

        const regexMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        for (let i = 0; i < emails.length; i++) {
            if (!regexMail.test(emails[i])) {
                emails[i] = false;
            }
        }

        const pathFile = path.join(__dirname, '..', 'public', 'images', req.files.excel[0].filename)
        deleteImage(pathFile); // Delete the excel file from the server

        res.status(200).send({
            status: true,
            message: 'Archivo excel leído correctamente.',
            data: emails
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

enterpriseController.createEnterpriseRol = async (req, res) => {
    try {
        const { idEnterprise } = req.params;
        const body = req.body;

        body.enterprise = idEnterprise;

        const enterprise = await Enterprise.findById(idEnterprise);

        if (!enterprise) {
            return res.status(404).send({
                status: false,
                message: 'Empresa no encontrada.'
            });
        }

        if(body.users) {
            const users = await User.find({ _id: { $in: body.users } });

            if (users.length !== body.users.length) {
                return res.status(404).send({
                    status: false,
                    message: 'Uno o más usuarios no se encontraron.'
                });
            };

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                if (user.enterprise.toString() !== idEnterprise) {
                    return res.status(400).send({
                        status: false,
                        message: 'Uno o más usuarios no pertenecen a la empresa.'
                    });
                }
            }

            // Actualizar permisos de los usuarios

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                user.permissions = body.permissions;

                await user.save();
            }
        }

        const enterpriseRol = new EnterpriseRol(body);

        const actualizedEnterprise = await Enterprise.findByIdAndUpdate(idEnterprise, { $push: { roles: enterpriseRol._id } }, { new: true }).deepPopulate(['members, cards, ', 'roles.users']);

        await enterpriseRol.save();

        res.status(200).send({
            status: true,
            message: 'Rol creado y permisos de los usuarios actualizados.',
            data: actualizedEnterprise
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

enterpriseController.updateEnterpriseRol = async (req, res) => {
    try {
        const { idEnterprise, idEnterpriseRol } = req.params;
        const body = req.body;

        const enterprise = await Enterprise.findById(idEnterprise);

        if (!enterprise) {
            return res.status(404).send({
                status: false,
                message: 'Empresa no encontrada.'
            });
        }

        const enterpriseRol = await EnterpriseRol.findById(idEnterpriseRol);

        if (!enterpriseRol) {
            return res.status(404).send({
                status: false,
                message: 'Rol no encontrado.'
            });
        }

        if (enterpriseRol.enterprise.toString() !== idEnterprise) {
            return res.status(400).send({
                status: false,
                message: 'El rol no pertenece a la empresa.'
            });
        }

        if(body.users) {
            const users = await User.find({ _id: { $in: body.users } });

            if (users.length !== body.users.length) {
                return res.status(404).send({
                    status: false,
                    message: 'Uno o más usuarios no se encontraron.'
                });

            };

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                if (user.enterprise.toString() !== idEnterprise) {
                    return res.status(400).send({
                        status: false,
                        message: 'Uno o más usuarios no pertenecen a la empresa.'
                    });
                }

                user.permissions = body.permissions;

                await user.save();
            }

            enterpriseRol.users = body.users;
        }

        enterpriseRol.name = body.name;
        enterpriseRol.permissions = body.permissions;

        await enterpriseRol.save();

        res.status(200).send({
            status: true,
            message: 'Rol actualizado y permisos de los usuarios actualizados.',
            data: enterpriseRol
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

enterpriseController.updateUserPermissions = async (req, res) => {
    try {
        const { idEnterprise, idUser } = req.params;

        const body = req.body;

        const enterprise = await Enterprise.findById(idEnterprise);

        if (!enterprise) {
            return res.status(404).send({
                status: false,
                message: 'Empresa no encontrada.'
            });
        }

        const userActualized = await User.findByIdAndUpdate(idUser, { permissions: body.permissions }, { new: true });
        
        res.status(200).send({
            status: true,
            message: 'Permisos del usuario actualizados.',
            data: userActualized
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = enterpriseController;