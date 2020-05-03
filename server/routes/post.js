const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
require('../model/post');
const Post = mongooose.model('Post')
const requirelogin = require('../middleware/requireLogin')


router.get('/allposts',(req,res)=>{
    Post.find()
    .populate("postedby","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body} = req.body
    if(!title || !body){
        res.status(422).json({error:"please add all fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedby:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requirelogin,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router