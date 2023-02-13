const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/biznes_empresa';

mongoose.set('strictQuery', true);

mongoose.connect(uri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(res => console.log(`[DATABASE] ✨✨ DB is connected succesfully!`))
    .catch(err => console.log(err));

module.exports = mongoose;

