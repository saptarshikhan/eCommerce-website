const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    pwd:String,
    contact:String
})

module.exports=mongoose.model('tblRegister',userSchema)