const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const bcrypt = require('bcryptjs');

const enterpriseRolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: String,
    permissions: [String],
    enterprise: {
        type: Schema.Types.ObjectId,
        ref: 'Enterprise'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
    versionKey: false
});

enterpriseRolSchema.plugin(deepPopulate);

module.exports = model('EnterpriseRol', enterpriseRolSchema);