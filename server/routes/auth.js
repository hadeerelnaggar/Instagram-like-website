const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
require('../model/user');
const User = mongooose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requirelogin = require('../middleware/requireLogin')

router.get('/protected',requirelogin,(req,res)=>{
    res.send("hello");
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" })
    }
    User.findOne({ email: email })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add all fields" })
    }
    User.findOne({ email: email })
        .then(saveduser => {
            if (!saveduser) {
                return res.status(422).json({ error: "invalid email or password" })
            }
            bcrypt.compare(password, saveduser.password)
                .then(match => {
                    if (match) {
                        const token =jwt.sign({_id:saveduser._id},JWT_SECRET)
                        const {_id,name,email,followers,followings} = saveduser
                        res.json({token,user:saveduser})
                    }
                    else {
                        return res.status(422).json({ error: "invalid email or password" })
                    }
                })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router