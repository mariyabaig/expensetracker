const mongoose = require("mongoose")
const DB = process.env.DB
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("Yayy, connection started")).catch((error)=> console.log(error.message));