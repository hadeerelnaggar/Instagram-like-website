const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const router = require('./routes/auth') 
const postrouter = require('./routes/post')

const {MONGOURI} = require('./keys');

require('./model/user')
require('./model/post')
app.use(express.json())
app.use('/',router)
app.use('/',postrouter)


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error',(err)=>{
    console.log("not connected to mongo:",err)
})



app.listen(PORT,()=>{
    //console.log("server is running on",PORT);
    console.log("server is running",PORT);
})