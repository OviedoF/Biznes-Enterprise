const {Schema, model} = require('mongoose');

const cardButtonSchema = new Schema({
    styles: {
        fontSize: String,
        color: String,
        letterSpacing: String,
        backgroundColor: String,
        borderRadius: String,
        width: String,
        height: String,
    },
    text: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = model('CardButton', cardButtonSchema);
