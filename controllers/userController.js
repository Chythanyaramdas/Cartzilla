const User = require("../models/userModel");
const banner = require('../models/bannerModel')
const  Categorie=require("../models/categoryModel")
const product=require("../models/productModel")
const coupon=require("../models/couponModel")
// const Cart=require("../models/cartModel")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { findById } = require("../models/couponModel");
const randormstring=require("randomstring")
const config=require('../config/config');
const { deleteAddress } = require("./orderController");
const order=require('../models/orderModel')

const {USER_MAIL,USER_PASSWORD}=process.env


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user: USER_MAIL,
    pass: USER_PASSWORD
  },
});
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

//======================================load register page==========================================================

const loadRegister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};

//===================================================load ottp page=================================================

const ottp = async (req, res, next) => {

  try {
    console.log("haiiiiii", req.body);
    req.session.name = req.body.name;
    req.session.email = req.body.email;
    req.session.mno = req.body.mobile;
    req.session.password = req.body.password;
    const Email = req.body.email;
    console.log(req.body.email);

    const user = await User.findOne({ email: req.body.email });
    console.log(user, "hiiiiiihere");
    if (!user) {
      console.log("no user");

      // send mail with defined transport object
      var mailOptions = {
        from: USER_MAIL,
        to: req.body.email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.render("otppage", { status: "false" });
      });
    } else {
      // res.render("home", { status: "true" });
      res.redirect('/home')
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};



//========================================== otp page load===========================================

const otppage = async (req, res) => {
  try {
    res.render("otppage");
  } catch (error) {}
};



//========================================= ottp compare==============================================

  const ottpCompare = async (req, res,next) => {

  try{
        req.session.otp=req.body.otp
        if(req.body.otp==otp)
        {
            console.log("iff")
            req.session.password=await bcrypt.hash(req.session.password,10);
            let newUser=new User({
               name: req.session.name,
              email : req.session.email ,
              
              password :req.session.password
            
            });

            console.log(newUser);
          newUser.save().then((data)=>{
            console.log(data,"oooo");
            req.session.useremail=req.session.email;
            req.session.userlogged=true;
            req .session.user=newUser;
            res.redirect("/sign");


        });
        }
        else{
            res.render("otppage",{status:"true"});
            
        }
    }
    catch(error){
console.log(error,"ree")
    }



};


//===================================================== Resend otp ===============================================


const resendOTP = async (req, res, next) => {
  try {
    const email = req.session.email; // Get the email from req.session.email

    // Generate a new OTP
    //  const resendotp = Math.floor(Math.random() * 1000000);

    // Set up the email message
    const mailOptions = {
      from: USER_MAIL,
      to: email, // Use the email from req.session.email
      subject: "OTP for registration",
      html: `<h3>Your OTP for resend account verification is:</h3><h1>${otp}</h1>`,
    };

    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        
      } else {
        res.render("otppage", { status: "true"});
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//================================================forget password================================================

const forgetLoad=async(req,res)=>{
  try {

    res.render('forget')
    
  } catch (error) {
    
  }
}


const verifyForget=async(req,res)=>{
  try{

    const email=req.body.email;
    const userData=await User.findOne({email:email})
    if(userData){
      req.session.userData=userData
      sendResetPasswordMail(email,res)

      
  }else{

      res.render('forget',{message:"user email is incorrect"})
      console.log("killodiidiiiii");
    }
  
}catch(error){

}
}

const sendResetPasswordMail=async(email,res)=>{
  
  try {

    var mailOptions = {
      from: USER_MAIL,
      to: email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for resend account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // res.render("otppage", { status: "false" })
        return console.log(error);
      }
      else {
        res.render("forgotOtp", { status: "true"});
      }
    });
    
} catch (error) {
    console.log(error.message)
}

}

 const forgotPassword=async(req,res)=>{
  try {
    console.log(otp);
    if(otp==req.body.otp){
      res.render('newPassword')
      console.log("okyyyyyyyyyyyyyyyyyy");
    }
    else{
        console.log("timeeeeeeeeee");
      res.render("otppage",{status: "false",message:"user otp is incorrect"})
    }
  } catch (error) {
    
  }
 } 
  
 const forgotPasswordPost=async(req,res)=>{
  try {
    const password = req.body.password
    const postData= await bcrypt.hash(password,10);
    console.log(postData);
    console.log(req.session.userData.name);
    const userData=await User.findOneAndUpdate({name:req.session.userData.name},{$set:{password:postData}},{new:true})
    console.log(userData);
    if(userData){

      res.redirect('/sign')
    }else{
      res.send('incorrect')
    }
    
    
  } catch (error) {
    console.log(error.message);
  }
 }


//===============================================loadSignIn=======================================================


const loadSignIn=async(req,res)=>{

      
  try{

    res.render('login')

  }
catch(error){
console.log(err);

}




  }
   




//=================================================Landing home  page==================================================

const loadLand=async(req,res)=>
{

  try {
   
    if(req.session.userid)
    {
    let userSession=req.session.userid;
    const  banners=await banner.find({is_delete:false})
    const category=await Categorie.find({})
    const products=await product.find({is_delete:false});
    const userData = await User.findById(req.session.userid).populate('cart.item.productId')
    console.log(category);
   console.log(banners);
    res.render('home',{userSession,banners,category,products,cart:userData.cart})

    }

    else
    {
      
    const  banners=await banner.find({is_delete:false})
    const category=await Categorie.find({})
    const products=await product.find({is_delete:false});
     
    console.log(category);
  // console.log(banners);
    res.render('home',{banners,category,products})


    }

    
  } catch (error) {
  
    console.log(error);
    
  }
  

}
//=================================Logout========================================================================

const userLogout=async(req,res)=>{

  try{
      req.session.userid="";
      res.redirect('/sign')

  }
  catch(error){

      console.log(error.message);
  }
}


//===================================================Verify signIn====================================================

const verifySignIn=async(req,res)=>{

  

    
    try {
    
      const email=req.body.email;
      const password=req.body.password
      const userData= await User.findOne({ email:email });
      console.log("yes start");


      

      if(userData)
      {
        console.log("yes here");
        const passwordMatch=await bcrypt.compare(password,userData.password)
        

        if(passwordMatch){
    
        if(userData.isBlocked)
       {       
        res.render('login',{message:"you are blocked"})
        console.log(false);
      }
    
      
      else{
       
        req.session.userid=userData._id;//starting of session 
       
        const category=await Categorie.find({})
       console.log("yes -se-s-s----------------------"+req.session.userid);
        
         res.redirect('/')
         var hai = 10;
      }
        
    }
else{
    res.render('login',{message:"Invalid  Password"})
}

      }else{
        res.render('login',{message:"Invalid User Or Password"})
      }

        
      


    

      
    } catch (error) {
      console.log(error)
    }
      }
    

//=====================================productDetails=====================================
const productListing=async(req,res)=>{
  try {

    let cid=req.query.cid|| "" 
    let products =await product.find({is_delete:false});
    let category=await  Categorie.find({is_delete:false});

    

    // console.log(products);
    res.render('productListing',{products,category,cid})
    
  } catch (error) {

    console.log(error);
    
  }
}

//====================================loadProducts=======================================

const loadProducts=async(req,res)=>{

  try {

    let search=req.query.search|| ""
    let sort=req.query.sort|| ""
    let pid=req.query.pid|| ""
    let cid=req.query.cid|| ""
    console.log(search);
    console.log(cid);
    console.log('kkoooooo');
    let isRender=req.query.isRender|| true;

    let userData;

    const query={
      is_delete:false
    };

    let sortQuery={price:1}

    if(search)

    query["$or"]=[{name:{$regex:".*"+search +".*",$options:"i"}}]

//===============pagination=======================================

    var page=1;
    var totalPages;
    if(req.query.page)
    {
      page=req.query.page
    }

    const limit=3;

    const user=await product.find({
      is_delete:false,
      $or:[
        {name:{$regex:'.*'+search+'.*',$options:'i'}},
        
      ]
    })

    if(sort && sort ==="high-to-low") sortQuery={price:-1};
    // if(cid)query["category"]=cid;
    if (cid) query["category"] = {$in:cid}
    const category=await Categorie.find({is_delete:false})

    if(req.session.userid)

    {
      userData=await User.find({_id:req.session.userid}).populate('cart.item.productId')
    }

    const products =await product.find(query).sort(sortQuery).limit(limit*1)
    .skip((page-1)*limit)
    .exec();
    const count=await product.find(query).countDocuments();
    console.log("count"+count);


    if(isRender == true)
    {console.log(userData);
      console.log('hi');
      res.render("productListing",{products,category,userData,pid,cid,totalPages:Math.ceil(count/limit)})
    
    }else{
      console.log('hello');
      res.json({
        success:true,
        products,
        category,
        userData,
        pid,
        cid,
        totalPages:Math.ceil(count/limit),
        currentPage:page
      })
    }
  } catch (error) {

    console.log(error.message);
    
  }
}
//========================================shopSingle======================================================================

const shopSingle=async(req,res)=>{

  try {

    const id=req.query.id
    console.log('id : ' + id)
    let userData;
    const orderLength = null
    const orderData = null
    if(req.session.userid){
      userData=await User.find({_id:req.session.userid}).populate('cart.item.productId')
      const orderData=await order.find({user:req.session.userid,'product.productId':id})
      console.log(orderData);
      const orderLength=orderData.length
    }
     
    const products=await product.findOne({_id: id})
    console.log('product : ' + products);
    const category=await Categorie.find({is_delete:false})
console.log(products.reviews.length);

console.log(orderLength);
    res.render('shopSingle',{products,category,userData,orderData,orderLength})

    
  } catch (error) {
    console.log();
    console.log(error);
    
  }
}



//=========================================================search===============================================================================

const search=async(req,res)=>{
  
  const query = req.query.q;
  

   
      try {
        const results = await product.find({ $text: { $search: query } });
        res.json(results);
      } catch (error) {
       console.log("error");
      }
    };
    
    
  

//================================================================= Cart  ===============================================================================
const loadCart=async(req,res)=>{

  try {
    
    const userData = await User.findById(req.session.userid).populate('cart.item.productId')
    res.render('cart',{cart:userData.cart})
    
  } catch (error) {
    
  }
}


const addToCart=async(req,res)=>{

  try {

    const quantity=parseInt(req.body.quantity)|| 1
    const productId=req.body.id;
    const price = parseInt(req.body.price);
    // const name=parseInt(req.body.name);
    // const image=req.file.fileName;
    // console.log("image"+image);
    const productData=await product.findById({_id:productId})
    console.log('prodata'+ productData);
    const userId=req.session.userid;
    const userData=await User.findById(userId)
    
    const indexNumber=userData.cart.item.findIndex(productItem=>{

      return new String(productItem.productId).trim()== new String(productData._id).trim()
    })

    if(indexNumber >=0){

      userData.cart.item[indexNumber].quantity+=quantity 
    }
    else{
      userData.cart.item.push({
        productId:productId,
        quantity:quantity,
        price:price,
        // name:name,
        // image:image
      })

      
    }
    
    userData.cart.totalPrice+=productData.price*quantity

    await userData.save()
    res.redirect('/cart')
    
  } catch (error) {
    console.log(error);
    
  }
}


const updateCart=async(req,res)=>{

  try {
    console.log('hello')
    const proId=req.body.id
    // const quantity=parseInt(req.body.quantity)
    const quantity=Number(req.body.quantity)
    console.log(quantity)
    const count=parseInt(req.body.count)
    const updatedCart= await User.findOneAndUpdate({

      _id:req.session.userid,
      "cart.item.productId":proId
    },
    {
      $inc:{

        "cart.item.$.quantity":count
      }

    },
    {

      new:true
    }
    
    
    ).populate("cart.item.productId");
console.log(updatedCart);
    const cart=updatedCart.cart;
    const total=cart.item.reduce((total,item)=>{
      return total+item.quantity*item.productId.price

    },0)
    console.log(total);

    cart.totalPrice=total;
    const updatedQuantity= await updatedCart.save();
    console.log(updatedQuantity);


    const product=updatedQuantity.cart.item.find(item=>{

      return item.productId._id.toString()==proId.toString()
    })


    console.log(product);
    const totalPrice=parseInt(product.quantity*product.productId.price)
    console.log(total);
    console.log(totalPrice);
    res.json({success:true,total,totalPrice,quantity:product.quantity})

    
  } catch (error) {
    console.log(error);
  }

}

// =========================================deleteCart===================================================


// 
async function deleteItem(userId,proId){
  const userData = await User.findOneAndUpdate({_id:userId},{$pull:{'cart.item':{productId:proId}}},{new:true});
  return userData
}


const deleteCartItem = async(req,res)=>{
  try {
      const proId = req.query.id
      const proTotalPrice = req.query.totalPrice
// normal remove the deleteItem funtion from here

      // const userData = await users.findOneAndUpdate({_id:req.session.user_id},{$pull:{'cart.items':{productId:proId}}},{new:true});
      const userData =await deleteItem(req.session.userid,proId)
      
      console.log(proTotalPrice);
      console.log(userData.cart.totalPrice);
      userData.cart.totalPrice -= proTotalPrice
      updatedUser = await userData.save()
      res.json({success:true,total:updatedUser.cart.totalPrice,user:updatedUser})
  } catch (error) {
      console.log(error.message);
  }
}

//=========================================Add wishlist==========================================


const loadWishlist=async (req, res) => {
  try {
    
    const userData = await User.findById(req.session.userid).populate('wishlist.product')
    // console.log(userData)
    res.render('wishlist', { wishlist: userData.wishlist ,userData})
  } catch (error) {
    console.log(error)
  }
}





const addToWishlist=async(req,res)=>{
  try {

   const  productId=req.body.id;

    const userData=await User.findById({_id:req.session.userid})
    const productData=await product.findById({_id:productId})

    const indexNumber=userData.wishlist.findIndex((productItem=>{

      return new String(productItem.product).trim()== new String(productData._id).trim()
    }))


    console.log(indexNumber);
    if(indexNumber >=0){
      res.render('wishlist',{message:"product already exist "})
      
    }
    else{
      userData.wishlist.push({
        product:productId,

      })
    }
    const updated=await userData.save();
    console.log(updated);
    
  } catch (error) {

    console.log(error);
    
  }
}

const addedToCart=async(req,res)=>{
  try {
    const productId=req.body.id;
    console.log(productId);
    const userData=await User.findById(req.session.userid)
    const productData=await product.findById(productId);
    let push=false;
    console.log(productData);
    const cartIndexNumber =userData.cart.item.findIndex((productItem)=>{
      console.log('7');
      console.log(productData);
      return new String(productItem.productId).trim()==new String(productData._id).trim()
    })
    console.log(cartIndexNumber);
    const wishlistIndexNumber=userData.wishlist.findIndex((item)=>{
      console.log('8');
      console.log(item.product);
      console.log(productData);
      return new String(item.product).trim()==new String(productData._id).trim()
    })
    console.log(wishlistIndexNumber);
    console.log(userData);
    userData.wishlist.splice(wishlistIndexNumber,1)
    console.log('splice');
    if(cartIndexNumber >= 0){

      userData.cart.item[ cartIndexNumber].quantity+=1
      console.log("hellooocart");
    }
    else
    {
      console.log('kk');
      userData.cart.item.push({
        productId:productId,
        quantity:1,
        price:productData.price,
 
      })
     
    }
    console.log(userData);
      userData.cart.totalPrice += productData.price 
      savedUserData = await userData.save()
      res.json({userData:savedUserData,success:true})



  } catch (error) {
    
  }
}


const deleteWishlist=async(req,res)=>{
  try {
      const productsId=req.query.id
    const userData=await User.findByIdAndUpdate(req.session.userid,{$pull:{wishlist:{product:productsId}}},{new:true})
    console.log(userData);
    if(userData){
      res.json({success:true,userData})
    }
    // const productData=await product.findById(productId)
    
  } catch (error) {
    console.log(error);
  }
  
}

//================================User Account=============================================================


const userAccount=async(req,res)=>{

  try {

    const userData= await User.findOne({_id:req.session.userid})
    // console.log(userData);

    res.render('userAccount',{userData})
    
  } catch (error) {
    console.log(error);
  }
}


const userAddress=async(req,res)=>{

  try {

    const userData=await User.findOne({_id:req.session.userid})
    const address=User.address;

    // console.log('userData'+ userData);
    res.render('address',{address,userData})
    
  } catch (error) {
    
  }
}

const postAddress=async(req,res)=>{
  try {


    
          
          let isExist = await User.findOne({ _id: req.session.userid });
  
          let newaddresss = {
  
              name: req.body.Name,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber,
              locality: req.body.locality,
              district: req.body.district,
              state: req.body.state,
              pinCode: req.body.pinCode,
  
          };
  
          await User.updateOne(
  
              { _id:req.session.userid  },
              { $push: { address: newaddresss } }
  
          );
  
          res.redirect("/address");
  
      } catch (error) {
  
         console.log(error)
  
      }
  
  }




  const deleteAddressPro=async(req,res)=>{
    try {

      addressId=req.query.id
      console.log("addressId"+addressId);
      const address=User.address;
      const userData=await User.findByIdAndUpdate(req.session.userid,{$pull:{address:{_id:addressId}},},{new:true})
   
      if(userData){
        res.json({success:true,userData})
      }
      
    } catch (error) {

      console.log(error);
    }
  }
  
    //===================================applyCoupon========================================
    
   

module.exports = { loadRegister, 
  otppage,
  ottpCompare,
  verifySignIn,
  ottp,
  resendOTP,
  loadSignIn,
  loadLand,
productListing,
shopSingle,
userLogout,
addToCart,
loadCart,
updateCart,
userAccount,
userAddress,
postAddress,
forgetLoad,
verifyForget,
sendResetPasswordMail,
forgotPassword,
forgotPasswordPost,
search,
loadProducts,
loadWishlist,
addToWishlist,
addedToCart,
deleteWishlist,
deleteAddressPro,
deleteCartItem
};
