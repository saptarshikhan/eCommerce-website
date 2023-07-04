require('./models/db')
const express=require('express')
const app=express()
const registerUser=require('./models/registerModel')
const registerSeller=require('./models/sellerRegisterModel')
const addItem=require('./models/addItemModel')
const vendorController=require('./controllers/vendor.controller')
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const { closeDelimiter } = require('ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.set('view engine','ejs')
let fname='';
let item=[]
var userLogin=false
app.get('/',(req,res)=>{
    addItem.find()
    .then((data)=>{
        res.render('home',{msg:'',data:data,userLogin:userLogin})
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
//======================================SESSION MANAGEMENT===================
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
secret: "thisismysecrctekey1",
saveUninitialized:true,
cookie: { maxAge: oneDay },
resave: false
}));

app.use(cookieParser());
//===========================================================================
app.post('/login',(req,res)=>{
    
    mail=req.body.email
    password=req.body.pwd
    var query={'email':mail,'pwd':password}
    registerUser.find(query)
    .then((data)=>{
        console.log(data)
        const userID=data._id;
        if(data.length==0)
        {
            res.render('home',{msg:'failed',data:item})

        }else{
            req.session.uid=userID;
            req.session.uname=data.name
            userLogin=true
        res.render('home',{msg:data[0].name,data:item,userLogin:userLogin})
        

        }
    }).catch((err)=>{
       
        console.log('err')
    })


})


//--------------------VENDOR---------------------------------------------


app.listen(3000,(req,res)=>{
    console.log('Server running...')
})