const mongoose = require('mongoose');
//import config globally
const config = require('config');
//get the any value
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        //connect to db
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...");
    }
    catch(err) {
        console.log(err.message);
        //kill the application running
        process.exit(1);
    }
}

module.exports = connectDB;