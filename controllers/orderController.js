const order=require('../models/orderModel')
const User=require("../models/userModel");
const product=require("../models/productModel")
const  category=require("../models/categoryModel")
const coupon=require("../models/couponModel")
const Razorpay=require('razorpay')



const {RAZORPAY_ID,RAZORPAY_KEY}=process.env

const loadCheckOut=async(req,res)=>{
    try {
       const id =req.query.id
        const userData=await User.findById(req.session.userid).populate('cart.item.productId')
        const address=userData.address  
        res.render('checkOut',{cart:userData,address})
        
    } catch (error) {
        console.log(error);
        
    }
}
// const checkOut = async(req,res)=>{
//     try {
//         console.log(req.body)
//         const userData = await User.findById(req.session.userid)
//         const cart = userData.cart
//         const totalPrice = cart.totalPrice
//         const payment = req.body.payment
//         const name = req.body.name
       
//         const phoneNumber = req.body.phoneNumber
//         const pinCode = req.body.pinCode
//         const address = req.body.address
//         const locality = req.body.locality
//         const state = req.body.state
//         const district = req.body.district
       
//         if(payment == 'COD'){
//             console.log('3');
//             const orderData = new order({
//                 user:req.session.userid,
//                 product:cart.item,
//                 paymentMethod:payment,
//                 totalPrice:totalPrice,
//                 customer:{
//                     name,
//                     phoneNumber,
//                     pinCode,
//                     locality,
//                     address,
//                     district,
//                     state
//                 },

//             })
//             const orderSuccess = await orderData.save() 
//             console.log(orderSuccess);
//             if(orderSuccess){

//                 const cartProducts=userData.cart.item
//                 for(let i=0;i<cartProducts.length;i++){

//                     const singleProduct=await product.findById(cartProducts[i].productId)
//                     singleProduct.quantity -= cartProducts[i].quantity 
//                     singleProduct.save()
//                 }
//                 console.log('kkk');
//                 userData.cart.item.splice(0,userData.cart.item.length)
//                 userData.cart.totalPrice=0
//                 userData.save()
//                 console.log("ejidiwoe90uweue9dp");
//                 res.json({success:true})
//             }
            
            
//         }

//     } catch (error) {
//         console.log(error.message);
//     }
// }


const checkOut=async(req,res)=>{
    try {
        const newAddress=req.body.addressId||''
        const userData=await User.findById(req.session.userid)
        const cart=userData.cart
        const subTotal=cart.totalPrice
        const payment=req.body.payment
        const name=req.body.name
        const phoneNumber=req.body.phoneNumber
        const pinCode=req.body.pinCode
        const address=req.body.address
        const locality=req.body.locality
        const state=req.body.state
        const district=req.body.district
        const paymentMethod=req.body.payment
        console.log('pincode');
        console.log(pinCode)
        if(!newAddress){
            const address={
                name:req.body.name,
                phoneNumber:req.body.phoneNumber,
                pinCode:req.body.pinCode,
                locality:req.body.locality,
                address:req.body.address,
                district:req.body.district,
                state:req.body.state
            }

            await User.findOneAndUpdate({_id:req.session.userid},{$push:{address:{...address}}})
            let totalPrice;
            if(!req.session.coupon){

                req.session.coupon={couponCode:undefined,discount:0}
                totalPrice=parseInt(subTotal)
            }
            else{
                console.log("coupon in session");
                 totalPrice=subTotal-subTotal*(req.session.coupon.discount)/100
                 console.log(totalPrice);

            }




        }
        const orderData=new order({

            user:req.session.userid,
            product:cart.item,
            paymentMethod:payment,
            totalPrice:subTotal,
            
            
            customer:{
                name,
                phoneNumber,
                pinCode,
                locality,
                address,
                district,
                state
            },

        })



        const orderSuccess=await orderData.save()
       
       
        if(payment == 'COD'){
            await coupon.findOneAndUpdate({couponCode:req.session.coupon.couponCode},{$push:{ couponUser:req.session.userid}})

            req.session.coupon=""
            console.log("33");
            if(orderSuccess){

                                const cartProducts=userData.cart.item
                                for(let i=0;i<cartProducts.length;i++){
                
                                    const singleProduct=await product.findById(cartProducts[i].productId)
                                    singleProduct.quantity -= cartProducts[i].quantity 
                                    singleProduct.save()
                                }
                                console.log('kkk');
                                userData.cart.item.splice(0,userData.cart.item.length)
                                userData.cart.totalPrice=0
                                userData.save()
                                console.log("ejidiwoe90uweue9dp");

        }
        res.json({success:true,cod:true}) 

    } 
    
    else{

        var instance=new Razorpay({
            key_id:RAZORPAY_ID,
            key_secret:RAZORPAY_KEY
        })

        var options={
            amount:subTotal,
            currency:"INR",
            receipt:""+orderSuccess._id
        };
        instance.orders.create(options,function(err,order){
            if(err){

                console.log("error"+error);
            }

            else{
                console.log(order);
                res.json({success:true,order})
            }
        })
        }
        
    }

        catch (error) {
        console.log(error);
        
    }

}

const verifyPayment=async(req,res)=>{
    try {

        orderId=req.body.order.receipt
        console.log("orderid"+ orderId);
        const crypto=require('crypto')
        const hmac=crypto.createHmac('sha256',RAZORPAY_KEY)
        .update(req.body.payment.razorpay_order_id+'|'+ req.body.payment.razorpay_payment_id)
        .digest('hex')
        console.log("hmac"+hmac);
        console.log(req.body.payment.razorpay_signature);

        if(hmac == req.body.payment.razorpay_signature){
            const update={$set:{
                paymentStatus:'charged'
            }}

            const options={new:true}
            await order.findByIdAndUpdate(orderId,update,options).then(()=>{
                res.json({success:true})
            })

            await coupon.findOneAndUpdate({couponCode:req.session.coupon.couponCode},{$push:{ couponUser:req.session.userid}})

            req.session.coupon=""
            const userData=await User.findById(req.session.userid)

            const cartProducts=userData.cart.item
            console.log("verifyyyyyy"+cartProducts.length);
            for(let i=0;i < cartProducts.length;i++){
                
                const singleProduct=await product.findById(cartProducts[i].productId)
                singleProduct.quantity -= cartProducts[i].quantity 
                singleProduct.save()
            }
            console.log('kkk');
            userData.cart.item.splice(0,userData.cart.item.length)
            userData.cart.totalPrice=0
            userData.save()
            console.log("ejidiwoe90uweue9dp");


        }

        else{
            res.json({paymentFailed:true})
        }
        
    } catch (error) {

        
    }
}






const orderSuccess=async(req,res)=>{
    try {

        res.render('orderSuccess')
        
    } catch (error) {
        console.log(error);
    }
}



const loadEditAddress=async(req,res)=>{

try {
    const addressId=req.query.aId
    console.log(addressId);
    const userData=await User.findOne({_id:req.session.userid},{cart:1,address:{$elemMatch:{_id:addressId}}})
    console.log(userData);
    const shippingAddress=userData.address
    console.log(shippingAddress);
    res.render('checkOutEdit',{userData,shippingAddress})
    
} catch (error) {
    
}

}
const editAddress=async(req,res)=>{
    try {
        
        const  addressId=req.body.id
        const filter={_id:req.session.userid,'address._id':addressId}

        const update={$set:{
            'address.$':{
                name:req.body.name,
            phoneNumber:req.body.phoneNumber,
            pinCode:req.body.pinCode,
            locality:req.body.locality,
            address:req.body.address,
            district:req.body.district,
            state:req.body.state
        }
        }}

        const options={new:true}
        const userData=await User.updateOne(filter,update,options)
        console.log(userData);
        if(userData.modifiedCount==1){
            res.redirect('/addToCheckOut')

        }

    } catch (error) {

        console.log(error);
        
    }
}



const deleteAddress=async(req,res)=>{
    try {

        const addressId=req.query.aId
        const filter={_id:req.session.userid}
        const update={
            $pull:{
                address:{_id:addressId},
            }
        }

        const options={new:true}
        const updatedData=await User.updateOne(filter,update,options)
        if(updatedData.modifiedCount ==1){
            res.redirect('/addToCheckOut')
        }
        
    } catch (error) {
        
        console.log(error);
    }
}

const orderHistory=async(req,res)=>{
    try {
        const categoryData=await category.find({is_delete:false})
        const orderData=await order.find({user:req.session.userid}).sort({createdDate:-1})
        console.log(orderData);
        res.render('orderHistory',{orderData,categoryData})
        
    } catch (error) {
        console.log(error);
        
    }
}


// const orderDetails=async(req,res)=>{

//     const orderId = req.query.oid
//     try {
//         const orderData=await order.findById( orderId).populate('product.productId')
//         const productData=await product.find({is_delete:false})
//         res.render('orderDetails',{orderData,productData})
        
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }

const orderDetails=async(req,res)=>{
const orderId = req.query.oid
    return new Promise((resolve,reject)=>{
        try {
            const userData = User.findById(req.session.user_id)
            const orderDetails = order.findById(orderId).populate({path:'product',populate:'productId'})
            console.log('orderDetails'+orderDetails);
        Promise.all([userData,orderDetails]).then(([userData,orderDetails])=>{ 
            res.render('orderDetails',{userData,orderDetails})
            resolve()
        })
        } catch (error) {
            console.log(error.message)
            reject(error)
        }
        
    })
}


// const cancelOrder=async(req,res)=>{
//     orderId=req.body.oid
//     try {
//        await order.findByIdAndUpdate(orderId,{$set:{orderStatus:"cancelled"}},{new:true})
        
//         .exec((error,data)=>{
//             if(error){
//                 console.log(error.message);
//             }else{
//                 res.json({success:true,orderStatus:data.orderStatus})
//             }
//         })
    
//     }
//     catch (error) {

//         console.log(error);
        
//     }
// }

const cancelOrder = async(req,res)=>{
    try {
        const oId = req.body.oId
        quantityToAdd=req.body.quantity
        await order.findByIdAndUpdate(oId,{
            $set:{
                orderStatus: 'Cancelled'
            }
        },{new:true}).exec((error,data)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log(data);
               data.product.map(async(products)=>{
                    await  product.findOneAndUpdate({_id:products.productId},{$inc: {
                        "quantity": products.quantity,
                      }},{new:true})
               })
                res.json({success:true,orderStatus:data.orderStatus})
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const returnOrder=async(req,res)=>{

    oId=req.body.oId
    console.log(oId)
    try {
        console.log("return order");
        await order.findByIdAndUpdate(oId,{$set:{orderStatus:'Returned',paymentStatus:"Refunded"}},{new:true}).exec((error,data)=>{
                if(error){
                    console.log(error.message);
                }
                else{

                    console.log(data);
               data.product.map(async(products)=>{
                    await  product.findOneAndUpdate({_id:products.productId},{$inc: {
                        "quantity": products.quantity,
                      }},{new:true})
               })

                    res.json({success:true,orderStatus:data.orderStatus})
                }
                   
        
        
            })
        }
    
catch (error) {

        console.log(error);
        
    }
}


const applyCoupon=async(req,res)=>{
    try {
        let coupons=req.query.coupon
        console.log(coupons);
        const userData=await User.findById(req.session.userid)
        await coupon.findOne({couponCode:coupons}).then((coupon)=>{

            console.log(coupon);
                   let message
                const totalPrice=userData.cart.totalPrice
               
                
            if(coupon){
                const userIndex=coupon.couponUser.findIndex((index)=>{


                    return new String(index).trim() == new String(req.session.userid).trim()
                })
                console.log(userIndex);
    
                    if(userIndex == -1 ){
                        const discount=coupon.discount
                        const couponCode=coupon.couponCode
                        const time=new Date()

                        if(time > coupon.expiryDate){
                            console.log("expiryyy")
                            message="coupon Expired"
                            res.json({message})
        
                        }
        
                        else if(totalPrice > coupon.maximumAmount)
                        
                        {
                            console.log("limitttttttttt");
                            const maximumAmount=coupon.maximumAmount
                            const message=`coupon limit is ${maximumAmount}`
                            req.session.coupon={couponCode,discount}
                            res.json({success:true,maximumLimit:true,message,totalPrice,couponCode,maximumAmount,discount})
                        }
        
                        else if(totalPrice < coupon.minimumAmount){
        
                                console.log("can'tttttttttt");
                            message=`coupon can't applied as it require range between ${coupon.minimumAmount} and ${coupon.maximumAmount}`
                            res.json({message})
                        }
                        else{
                            console.log("otherrrr");
                            req.session.coupon={couponCode:couponCode,discount:coupon.discount}
                            res.json({success:true,couponCode,discount,totalPrice})
                        }
        
        
                        
    
                    }
    
                    else{
                        message="coupon already used"
                        res.json({message})
                    }
            }

            else{
                message="invalid coupon"
                res.json({message})
            }

            
                
                })

      
    } catch (error) {

        console.log("error" + error);
      
    }
  }

  const productReview=async(req,res)=>{
    try {

        const productReviews=req.body.productReview
        console.log(productReviews);
        const pId=req.body.pid
        console.log("pId"+pId);
     await product.findByIdAndUpdate(pId,{$push:{reviews:{userReview:productReviews,userId:req.session.userid}}}).exec((data,error)=>{
            if(data){
                
                res.json({success:true})

            }

            else{

                console.log(error);

            }

        })

        
        


        
    } catch (error) {
        console.log(error);
        
    }
  }




  const updateProductReview = async(req,res)=>{
    try {
        const productReview = req.body.productReview
        console.log("hjg:"+productReview);
        const pId = req.body.productId
        console.log(pId);
        const reviewId  = req.body.reviewId;
        console.log(reviewId);
        console.log('hello update review');
        await product.findOneAndUpdate({_id:pId,'reviews._id':reviewId},{$set:{'reviews.$.userReview':productReview}},{new:true}).then((data)=>{
            if(data){
                res.json({success:true,productReview})
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}



module.exports ={
    loadCheckOut,
    checkOut,
    orderSuccess,
    orderHistory,
    orderDetails,
    cancelOrder,
    returnOrder,
    editAddress,
    loadEditAddress,
    deleteAddress,
    verifyPayment,
    applyCoupon,
    productReview,
    updateProductReview

    
    
}
