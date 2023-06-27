const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    SID:String,
    itemName:String,
    itemCategory:String,
    itemDetails:String,
    itemPrice:String,
    itemImg:String,
})

module.exports=mongoose.model('tbladdItem',userSchema)