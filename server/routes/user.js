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
router.put('/follow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(402).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{followings:req.body.followId}
        },{
            new:true
        }).select("-password")
        .then(result=>{
            res.json({result})
        }).catch(err=>{
            res.status(402).json({error:err})
        })
    }
    )

})

router.put('/unfollow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(402).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{followings:req.body.unfollowId}
        },{
            new:true
        }).select("-password")
        .then(data=>{
            res.json({data})
        }).catch(err=>{
            res.status(402).json({error:err})
        })
    }
    )

})

module.exports = router