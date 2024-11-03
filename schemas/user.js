var mongoose = require('mongoose')

const user = new mongoose.Schema({
    userName:{type:String,required:true},
    userEmail:{type:String,required:true},
    userPassword:{type:String,required:true},
    userCart:{type:[{
        productName:String,
        productPrice:Number,
        productQuantity:Number,
        productSize:String,
        productThumbnail:String
    }]},
    userWishlist:{type:[String]},
    userPhoneNumber:{type:Number}

})

var User=mongoose.model('User',user)
module.exports=User