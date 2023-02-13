const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const bcrypt = require('bcryptjs');

const membershipSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    days: {
        type: Number,
        required: true
    },

    priceWithOffer: {
        type: Number
    },

    image: {
        type: String,
        required: true
    },
    permissions: [Object],
}, {
    timestamps: true,
    versionKey: false
});

membershipSchema.plugin(deepPopulate);

module.exports = model('Membership', membershipSchema);