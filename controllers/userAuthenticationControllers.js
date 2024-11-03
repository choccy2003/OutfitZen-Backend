var User = require("../schemas/user")
var bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken')
const Auth = require("../schemas/auth")
const nodemailer = require("nodemailer");
require('dotenv').config();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'outfitzenapparels@gmail.com',
      pass: process.env.PASS_KEY
    }
  });
  
 const userSignup = async(req,res)=>{
    try{
        const {userName,userEmail,userPassword,otp,regenrateOtp} = req.body
        const userExist = await User.findOne({userEmail:userEmail}).exec()
        const savedOtp= await Auth.findOne({userEmail:userEmail}).exec()
        console.log(req.body)
        if(userExist){
            res.status(400).send({message:"Email already in use!"})
        }
        else if(userPassword && savedOtp){
                if(savedOtp.otp==otp && savedOtp.otpExpiry>Date.now()){
                    bcrypt.hash(userPassword,10).then((hashedPassword)=>{
                        const user = new User({
                            userName:userName,
                            userEmail:userEmail,
                            userPassword:hashedPassword,
                        })
                        
                        return user.save()
                    }).then(async()=>{
                        const otpDelete= await Auth.findOneAndDelete({userEmail:userEmail}).exec()
                        if(otpDelete){
                          res.status(201).send({message:"Signup Successful!"})  
                        }
                        else{
                            res.status(400).send({message:"Server issue"})
                        }
                         
                    })
                }
                else if(savedOtp.attemptsRemaining<=0){
                    res.status(400).send({message:"This account has been blocked contact support"})
                }
                else {
                    if(otp){
                        const updatedUser = await Auth.findOneAndUpdate(
                            { userEmail: userEmail }, 
                            { $inc: { attemptsRemaining: -1 } },
                            { new: true } 
                        );
                        
                        res.status(200).send({
                            message: `OTP incorrect! Attempts remaining: ${updatedUser.attemptsRemaining}`
                        });
                    }
                    else{
                        if(regenrateOtp){
                            const generatedOtp=Math.floor(Math.random()*9000) + 1000

                            var mailOptions = {
                              from: 'outfitzenapparels@gmail.com',
                              to: userEmail,
                              subject: 'Welcome to OutfitZen!',
                              text: "Your registeration OTP is "+generatedOtp
                            };
                            transporter.sendMail(mailOptions, async function(error, info){
                              if (error) {
                                res.status(400).send({message:"Please try again!"})
                              } else {
                                const generateOtpTable = await Auth.findOneAndUpdate({userEmail:userEmail},{otp:generatedOtp,otpExpiry:Date.now() + 300000})
                              if(generateOtpTable){
                                  res.status(200).send({message:"OTP sent to registered mail"})
                              }
                              else{
                                  res.status(400).send({message:"Please try again!"})
                              }
                              }
                            });  
                        }
                        else{
                            res.status(200).send({message:"OTP not provided try again!"})
                        }
                        
                    }

                }

            }
        else{
            const generatedOtp=Math.floor(Math.random()*9000) + 1000

              var mailOptions = {
                from: 'outfitzenapparels@gmail.com',
                to: userEmail,
                subject: 'Welcome to OutfitZen!',
                text: "Your registeration OTP is "+generatedOtp
              };
              transporter.sendMail(mailOptions, async function(error, info){
                if (error) {
                  console.log(error);
                  res.status(400).send("Please try again!1")
                } else {
                  console.log('Email sent: ' + info.response);
                  const generateOtpTable = await new Auth({
                    otp:generatedOtp,
                    otpExpiry:Date.now() + 300000,
                    userEmail:userEmail
                }).save()
                if(generateOtpTable){
                    res.status(200).send({message:"OTP sent to registered mail"})
                }
                else{
                    res.status(400).send("Please try again!")
                }
                }
              });  
              
            
            
            
        }
    }
    catch(err){
        res.send(err)
    }



}


 const userLoginAuth = async(req,res)=>{
    try{
    const {userEmail,userPassword} = req.body
    const userInformation = await User.findOne({userEmail:userEmail}).exec()

    if(userInformation && userEmail && userPassword){
        const match = await bcrypt.compare(userPassword,userInformation.userPassword)
        if(match){
            const token = jwt.sign({userId:userInformation._id},process.env.SECRET_KEY,{expiresIn:'30d'})
            res.cookie('token',token,{
                httpOnly:true,
                secure:false,
                maxAge: 1000 * 60 * 60 * 24 * 60
              })
              console.log(token)
              res.status(200).json({message:"Loged In Successfully"})
        }
        else{
            res.status(400).send({message:"Invalid Credentials!"})
        }
    }
    else{
        res.status(400).send({message:"Account not found!"})
    }

    }
    catch(err){
        res.status(400).send(err)
    }




}

const userSession = async(req,res)=>{
    try{
        const tokenCookie = req.cookies.token

        if(!tokenCookie){
            res.status(400).send({message:"Session Expired Please Login Again!"})
            
        }
        else{
        const decodedPayload = jwt.verify(tokenCookie,process.env.SECRET_KEY)
        if(decodedPayload){
            const userInformation = await User.findOne({_id:decodedPayload.userId}).exec()
            if(userInformation){
                res.status(200).send(userInformation)
            }
            else{
                res.status(400).send({message:"Session Expired Please Login Again!"})
            }
        }
        else{
            res.status(400).send({message:"Session Expired Please Login Again!"})
        }
        }

    }
    catch(err){
        res.status(400).send(err)
    }
}

const userCartUpdate = async(req,res)=>{
    try{
        const tokenCookie = req.cookies.token
        const {userCart} = req.body
        if(!tokenCookie){
            res.status(200).send("Session Expired!")
        }
        else{
            const decodedToken = jwt.verify(tokenCookie,process.env.SECRET_KEY)
            if(decodedToken){
                const user = await User.findOneAndUpdate({_id:decodedToken.userId},{userCart:userCart})
                if(user){
                    res.status(201).send({message:"Cart updated!"})
                }
                else{
                    res.status(400).send({message:"Server Timeout!"})
                }
            }
            else{
                res.status(200).send("Session Expired!")
            }
        }
    }
    catch(err){
        res.status(400).send({message:err})
    }
}

module.exports = { userSignup,userLoginAuth,userSession,userCartUpdate }