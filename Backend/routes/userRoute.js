const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    const newuser = new User({name:req.body.name,email:req.body.email,password:req.body.password})
    try {
        const user = await newuser.save()
        res.send('userregisterd successfully')
    } catch (error) {
        return res.status(400).send(error)
    }
});

router.post('/login',async(req,res)=>{
  const {email,password}= req.body
  let exist = await User.findOne({email});
  if (!exist) {
    return res.status(400).send('user not found')
  }
  if (exist.password !== password) {
    return res.status(400).send('invalid')
  }

let payload = {
   user:{
    id:exist._id,
    name:exist.name,
   }
}
  jwt.sign(payload,'jwtsecret',{expiresIn:3600000},
    (err,token)=>{
      if (err) throw err;
      return res.json({name:exist.name,token})
    }
    );


 module.exports=  isAuth = (req,res,next) => {
     const authorization =req.headers.authorization;
      if (authorization) {
        const token = authorization.slice(7,authorization.length); // Bearer XXXXXX
        jwt.verify(
          token,
          process.env.JWT_SECRET,
          (err,decode) => {
            if (err) {
              res.status(401).send({message:'invalid token'})
            }else{
              req.user = decode;
              next();
            }
          })
      }else{
        res.status(401).send({message:'no token'})
      }
    }
})

module.exports=router;