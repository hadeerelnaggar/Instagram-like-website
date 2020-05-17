const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
require('../model/post');
const Post = mongooose.model('Post')
const requirelogin = require('../middleware/requireLogin')


router.get('/allposts', requirelogin, (req, res) => {
    Post.find()
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/createpost', requirelogin, (req, res) => {
    const { title, body, url } = req.body
    console.log(title + " " + body + " " + url)
    if (!title || !body || !url) {
        res.status(422).json({ error: "please add all fields" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: url,
        postedby: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myposts', requirelogin, (req, res) => {
    Post.find({ postedby: req.user._id })
        .populate("postedby", "_id name")
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requirelogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedby", "_id name")
        .populate("postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                console.log(err)
                return res.status(402).json({ error: err })
            }
            res.json(result)
        })

})

router.put('/comment', requirelogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedby: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedby", "_id name")
        .populate("postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(402).json({ error: err })
            }
            res.json(result)
        })
})

router.put('/unlike', requirelogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedby", "_id name")
        .populate("postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(402).json({ error: err })
            }
            res.json(result)
        })

})

router.delete('/deletepost/:postId', requirelogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedby", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(402).json({ error: err })
            }
            if (post.postedby._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json({ message: "successfully deleted", result })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })

})

router.delete('/deletecomment', requirelogin, (req, res) => {
    Post.findByIdAndUpdate({ _id: req.body.postId })
        .populate("postedby", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(402).json({ error: err })
            }
            const comment = post.comments.filter(x => x._id.toString() === req.body.commentId.toString())[0];
            if (comment.postedby.toString() === req.user._id.toString()) {
                Post.findByIdAndUpdate(req.body.postId, {
                    $pull: { comments: { _id: req.body.commentId } }
                }, {
                    new: true
                })
                    .populate("comments.postedby", "_id name")
                    .populate("postedby", "_id name")
                    .exec((err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(data)
                            res.json({ message: "comment successfully deleted", data })
                        }
                    })
            }

        })


})


module.exports = router