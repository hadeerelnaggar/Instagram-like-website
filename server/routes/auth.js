const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
require('../model/user');
const User = mongooose.model('User')
const bcrypt = require('bcryptjs')

router.get('/',(req,res)=>{
    res.send("hello")
})

router.post('/signup',(req,res)=>{
     const {name,email,password} = req.body
     if(!email || !password || !name){
         return res.status(422).json({error:"please add all fields"})
     }
     User.findOne({email:email})
     .then((saveduser)=>{
         if(saveduser){
            return res.status(422).json({error:"user already exists with that email"})
         }
         bcrypt.hash(password,12)
         .then(hashedpassword=>{
                const user = new User({
                    email,
                    password:hashedpassword,
                    name
                })
                user.save()
                .then(user=>{
                    res.json({message:"saved successfully"})
                })
                .catch(err=>{
                    console.log(err);
                })
         })
         
     })
     .catch(err=>{
         console.log(err);
     })
     
})


module.exports = router