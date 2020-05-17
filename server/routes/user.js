const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
require('../model/post');
const Post = mongooose.model('Post')
const User = mongooose.model('User')
const requirelogin = require('../middleware/requireLogin')


router.get('/user/:id',requirelogin,(req,res)=>{
    const id=req.params.id
    User.findOne({_id:id})
    .select("-password")
    .then(user=>{
        Post.find({postedby:req.params.id})
        .populate("postedby","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:err})
    })
})

module.exports = router