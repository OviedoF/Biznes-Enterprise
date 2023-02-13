const {Schema, model} = require('mongoose');

const enterpriseSchema = new Schema({
    enterprise: {
        type: String,
        required: true
    },
    memberEmail: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('MemberInvitation', enterpriseSchema);