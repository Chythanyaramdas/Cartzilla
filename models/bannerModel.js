const mongoose = require('mongoose')

const bannerModel = mongoose.Schema({
    title:{
        type : String,
        required: true
    },
    image:[{
        type: String,
       
    }],
    url: {
        type: String ,
    },
    description:{
        type: String,
        required: true
    },
    is_Active: {
        type: Boolean,
        default: false
    },
    is_delete: { 
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Banner',bannerModel)