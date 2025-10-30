const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/user");

connect.then(()=>{
    console.log("DB has been connected");
})
.catch(()=>{
    console.log("Not connected successfully");
})

const dbschema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    password : {
        type: String,
        require: true
    }
});

const collection = new mongoose.model("users", dbschema);

module.exports = collection;