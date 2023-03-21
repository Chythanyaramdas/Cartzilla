const mongoose = require('mongoose');


const CategorieSchema = new mongoose.Schema({
  name: {
    type: String,
     required: true,
     unique:true
  },
  description: {
    type: String,
    required: true,
    unique:true
  }
  ,
  is_delete:{

    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model('Categorie', CategorieSchema);
