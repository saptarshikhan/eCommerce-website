require('./models/db')
const express=require('express')
const app=express()
const registerUser=require('./models/registerModel')
const cart=require('./models/addCartModel')
const registerSeller=require('./models/sellerRegisterModel')
const addItem=require('./models/addItemModel')
const vendorController=require('./controllers/vendor.controller')
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
var session = require('express-session');
const nodemailer = require('nodemailer');

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
        res.render('home',{msg:'',data:data,userLogin:userLogin,size:0})
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
app.use(session({
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
        let userID=data[0]._id;
        if(data.length==0)
        {
            res.render('home',{msg:'failed',data:item})
            //res.send({msg:'failed'})

        }else{

            session=req.session;
            session.uid=userID;
            session.mail=req.body.email
            console.log("Session Data="+req.session.uid)
            req.session.uname=data.name
            userLogin=true
            
            //console.log(session.cartItem)
            app.get('/cartCount');
            var x=session.itemCount
            console.log(x)
            res.render('home',{msg:data[0].name,data:item,userLogin:userLogin,size:x})
            //res.send({msg:'success'})

        }
    }).catch((err)=>{
       
        console.log(err)
    })


})
app.get('/cartCount',(req,res)=> {
    session=req.session;
    var bid="649283869b02089f8c6cd1cb"
    cart.find({bid:bid}).then((data)=>{
        session.itemCount= data.length
        console.log(session.itemCount)
        res.send({count:session.itemCount})
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/addCart',(req,res)=>{
    //console.log(req.query.id)
    var id=req.query.id
     var qry={_id:id}
     var bid=req.session.uid
     console.log("USRR ID="+bid)
     addItem.find(qry).then((data)=>{
        res.render('showCart',{data:data,uid:bid})
     })
     .catch((err)=>{
        console.log(err)
     })
})

app.post('/cartAdd',(req,res)=>{
    var newCart= new cart(req.body)
    .save()
    .then((data)=>{
        console.log('data saved')

        
    })
    .catch((err)=>{
        console.log(err)
    })
    
})
app.get('/cartCount',(req,res)=>{
    cart.find({bid:req.session.uid}).then((data)=>{
        size=data.length
        
    })
})
app.get('/getitemImage',(req,res)=>{

})
app.get('/cartDetails',(req,res)=>{
    cart.find({bid:req.session.uid}).then((data)=>{
        res.render('orderSummary',{data:data})
        //res.redirect('mail?to=&sub=&txt=')
        

    }).catch((err)=>{
        console.log(err)
    })
    
})
app.get('/mail',(req,res)=>{
    session=req.session;
    var to=session.mail
    var sub="Order Summary"
    var text="Order Placed Successfully "+new Date();
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sk.fake.mail.2003@gmail.com',
            pass: 'gzyjltcxzjmustum'
        }
    });
    let mailDetails = {
        from: 'sk.fake.mail.2003@gmail.com',
        to: to,
        subject: sub,
        text: text
    };
    
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
            res.render('orderPlaced')
        }
    });
})
//--------------------VENDOR---------------------------------------------


app.listen(3000,(req,res)=>{
    console.log('Server running...')
})