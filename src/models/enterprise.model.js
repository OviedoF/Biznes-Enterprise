const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const bcrypt = require('bcryptjs');

const enterpriseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    members: [{
        ref: 'User',
        type: Schema.Types.ObjectId
    }],
    templates: [{
        ref: 'CardTemplate',
        type: Schema.Types.ObjectId
    }],
    notifications: [{
        subject: String,
        message: String,
        redirect: String
    }],
    membership: {
        type: Schema.Types.ObjectId,
        ref: 'Membership',
    },
    roles: [{
        ref: 'EnterpriseRol',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true,
    versionKey: false
});

enterpriseSchema.plugin(deepPopulate);

enterpriseSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

enterpriseSchema.statics.comparePassword = async (receivedPassword, password) => {
    return await bcrypt.compare(receivedPassword, password);
};

module.exports = model('Enterprise', enterpriseSchema);