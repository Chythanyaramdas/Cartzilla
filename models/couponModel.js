const { Timestamp } = require('mongodb');
const mongoose=require('mongoose')
const couponSchema=new mongoose.Schema({

   
    couponCode:{
        type:String,
        required:true
    },
    discount:{
        type:String,
       
    },
    minimumAmount:{
        type:Number,
        required:true
    },

    maximumAmount:{
        type:Number,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    }, 

    is_delete:{
        type: Boolean,
        default: false
      },
    couponUser:[
        mongoose.Schema.Types.ObjectId
    ],


createdDate:{
    type:Date,
    default:Date.now
},
},
{
    timestamps:true
}
)


module.exports=mongoose.model('coupon',couponSchema);
