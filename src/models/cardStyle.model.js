const {Schema, model} = require('mongoose');

const cardStyleSchema = new Schema({
    body: {
        backgroundColor: String
    },
    profilePhoto: {
        borderRadius: String,
        borderColor: String,
        borderWidth: String
    },
    logo: {
        borderRadius: String,
        borderColor: String,
        borderWidth: String
    },
    name: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        wordSpacing: String,
        textAlign: String
    },
    job: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        wordSpacing: String,
        textAlign: String
    },
    email: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        wordSpacing: String,
        textAlign: String
    },
    biography: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        lineHeight: String,
        wordSpacing: String,
        textAlign: String
    },
    buttonVCard: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        backgroundColor: String,
        borderRadius: String,
        width: String,
        height: String,
    },
    buttonContact: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        backgroundColor: String,
        borderRadius: String,
        width: String,
        height: String,
    },
    buttonSocialFavorite: {
        borderRadius: String,
        color: String,
        backgroundColor: String,
    },
    buttonSocial: {
        borderRadius: String,
        color: String,
        backgroundColor: String,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('CardStyle', cardStyleSchema);