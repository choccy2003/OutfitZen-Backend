var mongoose = require('mongoose')

const products = new mongoose.Schema({

productName:{type:String,required:true},
productPrice:{type:String,required:true},
productImages:{type:[String],required:true},
productSizes:{type:[String],required:true},
productStockQuantity:{type:Number,required:true},
productOriginalPrice:{type:Number,required:true},
productBrandName:{type:String,required:true},
productReviews:{type:[{
    rating:{type:Number,required:true},
    review:{type:String,required:true},
    reviewTitle:{type:String,required:true},
    reviewedBy:{type:String,required:true},
    verifiedPurchase:{type:Boolean,required:true}
}]},
productCategory:{type:String,required:true}



})


var Products=mongoose.model('Products',products)
module.exports=Products