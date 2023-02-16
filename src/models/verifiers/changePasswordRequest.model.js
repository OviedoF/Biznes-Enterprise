const {Schema, model} = require('mongoose');

const changePasswordRequestModel = new Schema({
    code: String,
    state: String,
    email: String
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('changePasswordRequest', changePasswordRequestModel);