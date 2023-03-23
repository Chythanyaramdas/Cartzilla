const express=require("express");
const user_route=express();

user_route.set('view engine','ejs');
user_route.set('views','./views/users');


const session=require("express-session");
const config=require("../config/config");
// const auth=require("../middleWare/auth")
const auth=require("../middleware/auth")

// user_route.use(session({secret:config.sessionSecret,resave: true,
//     saveUninitialized: true}));


    user_route.use(
        session({
            secret: "keyboard cat",
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 8000000 }
        })
    );
    







const userController=require("../controllers/userController");
const orderController=require("../controllers/orderController")

user_route.get('/',userController.loadLand)

user_route.get('/register',userController.loadRegister);

user_route.post('/register',userController.ottp);

user_route.get('/otppage',userController.otppage)


user_route.post('/otp',userController.ottp)

user_route.get('/resendOtp',userController.resendOTP)

user_route.post('/ottpcompare',userController.ottpCompare);

user_route.get('/forget',userController.forgetLoad) ;

user_route.post('/forget',userController.verifyForget)

user_route.post('/forgotOtp',userController.forgotPassword);

user_route.post('/newPassword',userController.forgotPasswordPost)



user_route.get('/home',userController.loadSignIn)

user_route.get('/sign',userController.loadSignIn);

user_route.post("/sign",userController.verifySignIn);

user_route.get("/userLogout",userController.userLogout);



// ==========================productDetails============================

user_route.get('/productListing',userController.productListing);

//==========================shopSingle===============================


user_route.get('/shopSingle',userController.shopSingle);

//==============================search=========================
user_route.get('/search',userController.search)

user_route.get('/home/products',userController.loadProducts)

//============================cart==================================

user_route.get('/cart',auth.isLogin,userController.loadCart);

user_route.post('/addToCart',auth.isLogin,userController.addToCart)

user_route.post('/updateCart',userController.updateCart)

user_route.get('/home/deleteCartItem',auth.isLogin,userController.deleteCartItem)


//=========================wishlist============================

user_route.get('/wishlist',auth.isLogin,userController.loadWishlist)

user_route.post('/addToWishlist',auth.isLogin,userController.addToWishlist)

user_route.post("/addedToCart",userController. addedToCart)


//=============================Address================================

user_route.get('/userAccount',auth.isLogin,userController.userAccount)

user_route.get('/address',auth.isLogin,userController.userAddress)

user_route.post('/address',auth.isLogin,userController.postAddress)

 user_route.get('/deleteAddressPro',auth.isLogin,userController.deleteAddressPro)

user_route.get('/deleteWishlist',userController.deleteWishlist)

//==========================Checkout=================================
user_route.get('/addToCheckOut',auth.isLogin,orderController.loadCheckOut)

user_route.post('/procced-to-payment',orderController.checkOut)

user_route.get('/order-success',auth.isLogin,orderController.orderSuccess)

user_route.get('/orderHistory',auth.isLogin,orderController.orderHistory)

user_route.get('/orderDetails',auth.isLogin,orderController. orderDetails)

user_route.put('/cancel-order',auth.isLogin,orderController.cancelOrder)

user_route.put('/return-order',auth.isLogin,orderController.returnOrder)

user_route.get('/editAddress',auth.isLogin,orderController.loadEditAddress)

user_route.post('/postAddress',auth.isLogin,orderController.editAddress)

user_route.get('/deleteAddress',auth.isLogin,orderController.deleteAddress)


user_route.post('/verify-payment',orderController.verifyPayment)

user_route.get('/applyCoupon',orderController.applyCoupon)

user_route.post('/product-review',auth.isLogin,orderController.productReview)

user_route.post('/review',auth.isLogin,orderController.updateProductReview)



// user_route.get('/cartPage',auth.isLogin,userController.cartPage);



// user_route.get('*',function(req,res){
//     res.redirect('/register')

// })






module.exports=user_route;