// const mongoose=require('mongoose')

// const orderSchema=mongoose.Schema({
// orderItems:[{

// type:mongoose.Schema.Types.ObjectId,
// ref:'OrderItem',
// required:true


// }],

// shippingAddress1:
// {
//     type:String,
//     required:true,
// },

// shippingAddress2:{

//     type:String
// },

// city:{

//     type:String,
//     required:true,
// },

// country:{

//     type:String,
//     required:true,

// },

// phone:{

//     type:String,
//     required:true,
//     default:'Pending'
// },
// totalPrice:{

//     type:Number,
// },

// user:{

//     type:mongoose.Schema.Types.ObjectId,
//     ref:'User'
// },

// dateOrdered:{

//     type:Date,
//     default:Date.now,
// }


// })

// // productSchema.virtual('id').get(function(){

// //     return this._id.toHexString();
// // })

// // productSchema.set('toJSON',{

// //     virtuals:true,
// // })

// module.exports=mongoose.model('Order',orderSchema);

const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({   
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    product:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },quantity:{
            type : Number,
            required: true
        }
    }],
    paymentMethod:{
        type: String,
    },
    totalPrice:{
        type :Number,
        required: true
    },
    subTotal:{
        type:Number
    },
    discount:{
        type:Number
    },
    orderStatus:{
        type : String,
        default : 'Placed',
        enum:['Placed','Processing','Shipped','Delivered','Returned','Cancelled']
    },
    paymentStatus:{
        type : String,
        default:'Pending',
        enum:['Pending','Charged','Refunded']
    },
    customer: {
        name:String,
        phoneNumber: Number,
        pincode: Number,
        locality:String,
        address:String,
        district:String,
        state:String,
        pinCode:Number
    },
    createdDate:{
        type:Date,
        default:Date.now
    }
})

module.exports= mongoose.model("Order",orderSchema)