const mongoose = require("mongoose")


async function connectToDb(){
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to DB")
    }
    catch(err){
        console.log(err.message, "can't connect to DB")
    }
}


module.exports = connectToDb