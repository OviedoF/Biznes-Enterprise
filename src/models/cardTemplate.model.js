const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const cardTemplateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    perfilImage: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    biography: {
        type: String
    },
    logoPhoto: {
        type: String,
        required: true
    },
    jobPosition: {
        type: String
    },
    jobEntity: {
        type: String
    },
    email: {
        type: String
    },
    description: {
        type: String
    },
    socialMedia: [{
        color: String,
        name: String,
        url: String,
        favorite: Boolean,
        contrast: String
    }],
    location: {
        country: String,
        city: String,
        address: String
    },
    vcard: {
        type: String
    },
    vcardWants: {
        type: Boolean,
    },
    addContact: {
        type: Boolean,
        default: false
    },
    imageQr: {
        type: String,
        required: true
    },
    downloadQr: {
        type: String,
        required: true
    },
    cardLink: {
        type: String,
        required: true,
        unique: true
    },

    cardStyle: {
        type: Schema.Types.ObjectId,
        ref: 'CardStyle'
    },

    cellphone: {
        type: String
    },

    additionalButtons: [{
        type: Schema.Types.ObjectId,
        ref: 'CardButton'
    }],

    /* propiedades de empresa */

    enterprise: {
        type: Schema.Types.ObjectId,
        ref: 'Enterprise'
    }, // empresa a la que pertenece la plantilla
    
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'EnterpriseRol'
    }], // roles que pueden editar la plantilla

    /* propiedades de usuario */

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }], // usuarios que pueden editar la plantilla
}, {
    timestamps: true,
    versionKey: false
});

cardTemplateSchema.plugin(deepPopulate);

module.exports = model('CardTemplate', cardTemplateSchema);