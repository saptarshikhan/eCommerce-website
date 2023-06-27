const express = require("express");
const router = express.Router();
const multer  = require('multer')
const registerSeller=require('.././models/sellerRegisterModel')
const addItem=require('.././models/addItemModel')
router.use(express.static('public'))
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
router.post('/selReg',upload.single('img'),(req,res)=>{
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
            res.render('home',{msg:'failed'})
        }else{
           
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
router.post('/itemAdded',(req,res)=>{
    const item=new addItem(req.body);
    item.SID=sellerID;
    item.save()
    
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
module.exports=router