const mongoose = require('mongoose');

//create a Schema 
// which presents how the Feusers looks

//create an object and describe the properties
const FeuserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    email: {
        type: String,
        required: true
    },
    role: String
});

//create Feuser, Feusers is our collection (table) in mongo
const Feuser = mongoose.model('Feusers', FeuserSchema);
//export the Feuser schema-object
module.exports = Feuser;
