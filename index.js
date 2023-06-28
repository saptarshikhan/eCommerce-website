require('./models/db')
const express=require('express')
const app=express()
const registerUser=require('./models/registerModel')
const registerSeller=require('./models/sellerRegisterModel')
const addItem=require('./models/addItemModel')
const vendorController=require('./controllers/vendor.controller')
var bodyParser = require('body-parser')
const { closeDelimiter } = require('ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.set('view engine','ejs')
let fname='';
let item=[]
app.get('/',(req,res)=>{
    addItem.find()
    .then((data)=>{
        res.render('home',{msg:'',data:data})
        item=data;
        
    })
    .catch((err)=>{
        console.log(err)
    } 
)})  
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
            res.render('home',{msg:'failed',data:item})
        res.redirect('home')

        }else{
            console.log(data.name)
        res.render('home',{msg:data[0].name,data:item})
        res.redirect('home')

        }
    }).catch((err)=>{
       
        console.log('err')
    })


})

//--------------------VENDOR---------------------------------------------


app.listen(3000,(req,res)=>{
    console.log('Server running...')
})