const express=require("express");
const admin_route=express();
const mime=require('mime-types')




admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');


const session=require('express-session');
const config=require("../config/config");
const auth=require("../middleware/adminAuth")    

// admin_route.use(session({secret:config.sessionSecret,resave: true,
//     saveUninitialized: true}));



admin_route.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 8000000 }
    })
);


const multer=require("multer")
const path=require("path");

const storage=multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,path.join(__dirname,'../public/img/marketplace/products'));
    },

    filename:function(req,file,cb){

        const name=Date.now()+'-'+file.originalname;
        cb(null,name)

    }

});




const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg'  ){
        cb(null,true)
    }else{
        console.log("error");
        cb(null,false)
    }
   
}

const upload=multer({storage:storage,fileFilter})


     
    




  

const adminController=require("../controllers/adminController");
const { log } = require("console");


admin_route.get('/', adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/category',adminController.CategoryPage)

admin_route.get('/addCategory',adminController.loadAddCategory);

admin_route.post('/addCategory',adminController.loadCategory);

admin_route.get('/dashBoard',adminController.loadDashBoard);

admin_route.get("/edit-category",adminController.editCategoryLoad);

admin_route.post("/edit-category",adminController.updateCategory);

admin_route.get("/delete-category",adminController.deleteCategory);

//========================product=============================================

 admin_route.get('/product',upload.array('image',10),adminController.products)


admin_route.get('/addProduct',upload.array('image',10),adminController.loadAddProduct);


 admin_route.post('/addProduct',upload.array('image',10),adminController.addProduct);


admin_route.get('/updateProduct',adminController.editProduct)


 admin_route.post("/updateProduct",upload.array('image',10),adminController.updateProduct);


 admin_route.get("/deleteimage",adminController.deleteImage)


 admin_route.get('/deleteProduct',adminController.deleteProduct);



// admin_route.get('/usermanag',adminController.loadUserMangagement);

//===========================user=====================================================

admin_route.get('/user',adminController.userManagement);

admin_route.get('/blockUser',adminController.blockUser);

admin_route.get('/UnblockUser',adminController.UnblockUser);

admin_route.get('/deleteUser',adminController.deleteUser)

//====================banner============================================================

// admin_route.get('/banners',upload.array('image'),adminController.loadBannerManagement)
// admin_route.get('/banner/add_banner',upload.array('image',10),adminController.loadaddBanner)
// admin_route.post('/banner/add_banner',upload.array('image',10),adminController.addBanner)
// admin_route.get('/banners/update_banner',upload.array('image',10),adminController.loadupdateBanner)
// admin_route.post('/banners/update_banner',upload.array('image',10),adminController.updateBanner)
// admin_route.get('/banners/delete_banner',adminController.deleteBanner);

admin_route.get('/banners',upload.single('image'),adminController.loadBannerManagement)


 admin_route.get('/banner/add_banner',upload.single('image'),adminController.loadaddBanner)




 admin_route.post('/banner/add_banner',upload.single('image'),adminController.addBanner)




 admin_route.get('/banners/update_banner',upload.single('image'),adminController.loadupdateBanner)




 admin_route.post('/banners/update_banner',upload.single('image'),adminController.updateBanner)




admin_route.get('/banners/delete_banner',adminController.deleteBanner);


//============================coupon================================================

admin_route.get('/coupon',adminController.coupons)

admin_route.get('/addCoupon',adminController.loadaddCoupon);

admin_route.post('/addCoupon',adminController.addCoupon);

admin_route.get('/updateCoupon',adminController.loadupdateCoupon);

admin_route.post('/updateCoupon',adminController.updateCoupon);

admin_route.get('/deleteCoupon',adminController.deleteCoupon);


//======================order================================

admin_route.get('/order',adminController.orderPage);


admin_route.get('/orderDetails',adminController.viewOrderDetails);

admin_route.post('/orderDetails',adminController.orderStatusChange)

//========================salesReport===========================


admin_route.get('/salesReport',adminController.loadSalesReport)

admin_route.post('/download-salesReport',adminController.salesReportDownload)

admin_route.get('/date-by-order',adminController.loadSalesReport)

// admin_route.get('*',function(req,res){
//     res.redirect('/admin')

// })

module.exports=admin_route


