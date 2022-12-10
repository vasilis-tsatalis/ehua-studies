const mongoose = require('mongoose');
require('dotenv/config');

//----------RUN & CONNECT DB----------//
//connect to mongodb
//here is a promise
// mongoose.connect(process.env.DB_CONNECTION);
// const db = mongoose.connection;
// db.on('error', console.log.bind(console, "MongoDB connection error"));
// db.once('open', function(callback){
//     console.log("MongoDB connection succeeded");
// });

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
    role: String,
    refcode: {
        type: String,
        required: true
    }
});

//create Feuser, Feusers is our collection (table) in mongo
const Feuser = mongoose.model('Feusers', FeuserSchema);
//export the Feuser schema-object
module.exports = Feuser;
