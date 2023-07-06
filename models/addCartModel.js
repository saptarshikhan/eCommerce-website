const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    bid:String,
    itemID:String,
    itemName:String,
    itemPrice:String,
    itemQuantity:Number
})

module.exports=mongoose.model('tbladdItemCart',userSchema)