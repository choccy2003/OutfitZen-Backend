var mongoose = require('mongoose')

const auth = new mongoose.Schema({

    otp:{type:Number,required:true},
    otpExpiry:{type:Number,required:true},
    userEmail:{type:String,required:true},
    attemptsRemaining:{type:Number,default:5}

})

var Auth=mongoose.model('Auth',auth)
module.exports=Auth