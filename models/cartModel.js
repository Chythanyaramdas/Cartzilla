// const mongoose=require('mongoose');
// const {ObjectId}=require("mongodb")
// const User = require("../models/userModel");
// const product=require("../models/productModel")

// const cartSchema=new mongoose.Schema({


//     user:{
//         type:ObjectId,
//         ref:User
//      },

//      address:[{
//         firstName:{type:String},
//         lastName:{type:String},
//         house:{type:String},
//         post:{type:String},
//         city:{type:String},
//         district:{type:String},
//         state:{type:String},
//         pin:{type:Number}
//    }],

//    products:[{
//     productId:{
//        type:ObjectId,
//        ref:product,
//     },
//     quantity:{
//       type:Number,
//       default:0
//     },
//     productPrice:{
//       type:Number,
//       default:0
//     },
//     totalPrice:{
//       type:Number,
//       default:0
//     }

// }]


// })

// module.exports=mongoose.model('Cart',cartSchema)