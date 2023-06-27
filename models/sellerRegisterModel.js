const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    address:String,
    pwd:String,
    contact:String,
    img:String
})

module.exports=mongoose.model('tblSellerRegister',userSchema)