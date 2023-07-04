const express = require("express");
const router = express.Router();
const multer  = require('multer')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
router.use(express.json())
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
const registerSeller=require('.././models/sellerRegisterModel')
const addItem=require('.././models/addItemModel')
router.use(express.static('public'))
var fname='NA'

//=========================Session Management===========================
const oneDay = 1000 * 60 * 60 * 24;
router.use(sessions({
secret: "thisismysecrctekey",
saveUninitialized:true,
cookie: { maxAge: oneDay },
resave: false
}));

router.use(cookieParser());

//======================================================================
var mstorage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, 'public/upload');    
    }, 
    filename: function (req, file, cb) {
        fname=file.originalname 
       cb(null , file.originalname);   
    }
 });
 const upload=multer({
    storage:mstorage
 })

router.get('/selRegister',(req,res)=>{
    res.render('sellerRegistration')
})
router.post('/selReg',upload.single('selImg'),(req,res)=>{
    const newSeller=new registerSeller(req.body);
    console.log(newSeller)
    newSeller.save()
    .then((data)=>{
        console.log('data saved')
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})
var sellerID='NA'
router.post('/selLogin',(req,res)=>{
    selMail=req.body.email
    selPwd=req.body.pwd
    var query={'email':selMail,'pwd':selPwd}
    registerSeller.find(query)
    .then((data)=>{
        sellerID=data[0]._id
        
        if(data.length==0)
        {
            
            res.render('home',{msg:'failed',data:[]})
        }else{
            req.session.sid=sellerID;
        res.render('Dashboard/index')
        }
    }).catch((err)=>{
       
        console.log(err)
    })
})
router.get('/sellerDashboard',(req,res)=>{
    res.render('./Dashboard/index')
})
router.get('/addItem',(req,res)=>{
    res.render('addItem')
})
router.post('/itemAdded',upload.single('itemImg'),(req,res)=>{
    const item=new addItem(req.body);
    item.itemImg=fname
    item.SID=sellerID;
    item.save()
    res.redirect('showItem')
    
})
router.get('/showItem',(req,res)=>{
    addItem.find()
    .then((data)=>{
        res.render('showItem',{data:data})
        
    })
    .catch((err)=>{
        console.log(err)
    })
    
})
router.get('/itemDelete',(req,res)=>{
    var id=req.query.id;
    console.log(id)
    addItem.findByIdAndDelete(id)
    .then(()=>{
        res.redirect("showItem")
    })
    .catch((err)=>{
        console.log(err)
    })
})
router.get('/itemModify',(req,res)=>{
    var id=req.query.id;
    var qry={_id :id}
    addItem.find(qry).then((data)=>{
        res.render('modifyItem',{data:data})
    }).catch((err)=>{
        console.log(err)
    })
    
})
router.post('/itemUpdate',upload.single('itemImg'),(req,res)=>{
    addItem.updateMany({_id:req.body.id},{$set: {itemName:req.body.itemName,itemCategory:req.body.itemCategory, itemDetails:req.body.itemDetails,itemPrice:req.body.itemPrice,itemImg:req.body.itemImg}}).then((data)=>{
        console.log('Data Modified')
        res.redirect('showItem')
    })
    .catch((err)=>{
        console.log(err)
    })
})
module.exports=router