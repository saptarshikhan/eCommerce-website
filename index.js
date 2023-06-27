require('./models/db')
const express=require('express')
const app=express()
const registerUser=require('./models/registerModel')
const registerSeller=require('./models/sellerRegisterModel')
const vendorController=require('./controllers/vendor.controller')
var bodyParser = require('body-parser')
const { closeDelimiter } = require('ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.set('view engine','ejs')
const multer  = require('multer')   
let fname='';

app.get('/',(req,res)=>{
    res.render('home',{msg:''})
})  
app.use('/seller',vendorController)

app.post('/register',(req,res)=>{
    const newUser=new registerUser(req.body);
    newUser.save().then((data)=>{
        console.log('Data Saved...')
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})
app.post('/login',(req,res)=>{
    mail=req.body.email
    password=req.body.pwd
    var query={'email':mail,'pwd':password}
    registerUser.find(query)
    .then((data)=>{
        console.log(data)
        if(data.length==0)
        {
            res.render('home',{msg:'failed'})
        }else{
            console.log(data.name)
        res.render('home',{msg:data[0].name})
        }
    }).catch((err)=>{
       
        console.log('err')
    })


})

//--------------------VENDOR---------------------------------------------


app.listen(3000,(req,res)=>{
    console.log('Server running...')
})