const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},

 email:{

    type:String,
    required:true
},
password:{

    type:String,
    required:true
},

// mno:{
//     type:String,
//     required:true
// },
/*image:{
    type:String,
    required:true
}, */
is_admin:{   
     type:Number,
     default:0,
     required:true
    
 },
is_varified:{
    type:Number,
    default:0
},

status:{

    type:String,
    default:"unbanned"
},

token:{
    type:String,
    default:''
},

address:[
    {

        name:{type:String},
        address:{type:String},
        phoneNumber:{type:String},
        locality:{type:String},
        district:{type:String},
        state:{type:String},
        pinCode:{type:Number}
    }
],

isBlocked:{
    type:Boolean,
    default:false
},

cart:{

    item:[

        {
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'product',
                required:true

            },

            quantity:{

                type:Number,
                required:false,
                    // min:1  
                    //  default:NaN 
                    default:0
            },

            price:{

                type:Number,
                required:true
            },


            // name:{
            //     type:String,
            //      required:true
            // },

            // image:{

            //     type:String,
            //      required:true
            // }


        }




    ],

    totalPrice:{
        type:Number,
    
        default:0
    }

    
},
wishlist: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'product'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  shippingAddress:[
    {
        name:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        pinCode:{
            type: Number,
            required: true
        },
        locality:{
            type:String,
            required: true
        },
        address:{
            type:String,
            required:true
        },
        district:{
            type : String,

        },
        state:{
            type: String
        }


    }
]

},{
    timestamps:true
},




);


// userSchema.methods.addCart=function(productData){


//     const cart=this.cart
    
//     const isExisting=cart.item.findIndex(objInItems =>{
    
    
//         return new String(objInItems.id).trim()==new String(productData._id).trim()
//     })
    
//     console.log(isExisting);
    
//     if(isExisting >=0)
//     {
//         cart.item[isExisting].quantity +=1
//     }
    
//     else{
    
//         cart.item.push({
//           productId : productData._id,
//           quantity:1,
//           price:productData.price,
//           name:productData.name,
//           image:productData.image
//         })
//     }
    
//     cart.totalPrice+=productData.price
//     return this.save()
//     }

module.exports=userModel=mongoose.model('User',userSchema);






