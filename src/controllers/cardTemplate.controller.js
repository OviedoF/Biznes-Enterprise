const path = require('path');
const { deleteReqImages, deleteImage } = require(path.join(__dirname, '..', 'utils', 'images.utils'));
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CardTemplate = require(path.join(__dirname, '..', 'models', 'cardTemplate.model'));
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const { v4 } = require('uuid');
const CardStyle = require(path.join(__dirname, '..', 'models', 'cardStyle.model'));
const CardButton = require(path.join(__dirname, '..', 'models', 'cardButton.model'));

const cardTemplateController = {};

cardTemplateController.createTemplate = async (req, res) => {
    try {
        const perfilImage = req.files ? req.files.perfilImage && req.files.perfilImage[0] : `${process.env.ROOT_URL}static/userimage.png`// image profile
        let imageCover = req.files ? req.files.coverImage && req.files.coverImage[0] : `${process.env.ROOT_URL}static/defaultbanner.webp`; // image cover
        let logoImage = req.files ? req.files.logo && req.files.logo[0] : null; // image logo
        const { styles, additionalButtons } = req.body;
        let { cardLink } = req.body;
        const { vcardWants } = req.body;
        let additionalButtonsArray = [];
        let additionalButtonsParsed = JSON.parse(additionalButtons)
        const token = req.headers.authorization.split(' ')[1];
        const { id: enterpriseid } = jwt.verify(token, process.env.SECRET_KEY);

        const enterprise = await Enterprise.findById(enterpriseid);

        if (!enterprise) return res.status(404).json({
            status: false,
            message: 'Empresa no encontrada'
        });

        const code = v4();

        const newStyleSheet = new CardStyle(JSON.parse(styles));

        const userSocial = [];
        const { socialMedia } = req.body;

        if (socialMedia) {
            for (let i = 0; i < socialMedia.length; i++) {
                userSocial.push(JSON.parse(socialMedia[i]));
            };
        }

        if (additionalButtonsParsed && additionalButtonsParsed.length > 0) {
            for (let i = 0; i < additionalButtonsParsed.length; i++) {
                const newButton = new CardButton(additionalButtonsParsed[i]);
                await newButton.save();
                additionalButtonsArray.push(newButton._id);
            };
        }
        
        const newTemplate = new CardTemplate({
            ...req.body,
            coverPhoto: imageCover ? `${process.env.ROOT_URL}images/${imageCover.filename}` : false,
            perfilImage: perfilImage ? `${process.env.ROOT_URL}images/${perfilImage.filename}` : false,
            logoPhoto: logoImage ? `${process.env.ROOT_URL}images/${logoImage.filename}` : false,
            cardLink: cardLink ? cardLink : code,
            user: enterpriseid,
            cardStyle: newStyleSheet._id,
            socialMedia: userSocial,
            historialStyles: [newStyleSheet._id],
            vcardWants: vcardWants || false,
            additionalButtons: additionalButtonsArray ? additionalButtonsArray : [],
            enterprise: enterprise._id,
            roles: req.body.roles ? req.body.roles : [],
            users: req.body.users ? req.body.users : []
        });

        const enterpriseCardsOld = enterprise.templates;
        enterpriseCardsOld.push(newTemplate._id);

        await Enterprise.findByIdAndUpdate(enterpriseid, {
            templates: enterpriseCardsOld
        });

        await newStyleSheet.save();
        await newTemplate.save();

        res.status(200).send({
            status: true,
            message: 'Template creada correctamente!',
            data: newTemplate
        });
    } catch (error) {
        console.log(error);
        deleteReqImages(req);
        res.status(500).json({
            status: false,
            message: 'Error creating card'
        });
    }
};

module.exports = cardTemplateController;