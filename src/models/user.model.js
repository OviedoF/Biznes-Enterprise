const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userImage: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: 'Role',
        type: Schema.Types.ObjectId
    }],
    notifications: [{
        subject: String,
        message: String,
        redirect: String
    }],
    googleId: {
        type: String,
        required: false
    },

    /* propiedades de empresa */ 

    enterprise: {
        type: Schema.Types.ObjectId,
        ref: 'Enterprise',
    },
    
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }],

    editPermissions: [{
        name: String,
        value: Boolean,
        limit: Number
    }]
}, {
    timestamps: true,
    versionKey: false
});

userSchema.plugin(deepPopulate);

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
};

module.exports = model('User', userSchema);