const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const productSchema = mongoose.Schema({


  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price:{
    type:Number,
    required:false
},
image:[{
  
  type:String
  // required:false,
}],
category:{
  type : ObjectId,
  ref : 'Categorie',
  required : true
},


quantity: {
  type: Number,
  required: true
},
is_delete:{
  type: Boolean,
  default: false
},
reviews:[{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },

  userReview:{
    type:String
  },
  
  createdDate:{
    type:Date,
    default:new Date()
  }
  
}],


});

module.exports = mongoose.model('product', productSchema);
