require('dotenv').config()
const mongoose=require("mongoose");
mongoose.set('strictQuery',false);
mongoose.connect( "mongodb+srv://Chythanya:chy_thu3@mongoclient.qo884kd.mongodb.net/user_management_system?retryWrites=true&w=majority");

const express=require("express");
const session=require("express-session")
const app=express();
const path=require('path')
const multer=require("multer")






// const storage=multer.diskStorage({

//     destination:function(req,file,cb){

//         cb(null,path.join(__dirname,'../public/img/marketplace/products'));
//     },

//     filename:function(req,file,cb){

//         const name=Date.now()+'-'+file.originalname;
//         cb(null,name)

//     }

// });
// const upload=multer({storage:storage})


// const fileFilter = (req,file,cb)=>{
//     if(file.mimetype ==='image/png' || file.mimetype ==='image.jpg' || file.mimetype ==='image/jpeg'){
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
   
// }


// app.use(multer({storage : storage,fileFilter:fileFilter}).fields([{name:"image",maxCount:2}]))


app.use(express.static(path.join(__dirname,'public')))

// no-cache
app.use(function (req, res, next) {
    res.set("cache-control", "no-store");
    next();
  })

  const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))




app.use(express.static(path.join(__dirname,'public')))

app.set('views',path.join(__dirname,"views"))
app.set("view engine","ejs")

//for use routes
const userRoute=require('./routes/userRoute');
app.use('/',userRoute);

const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute);

const errorController=require('./controllers/errorController')
app.use(errorController.get404);







app.listen(8000,function(){

    console.log("server is running...");
})