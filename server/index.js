const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const router = require('./routes/auth') 
const postrouter = require('./routes/post')
const userrouter = require('./routes/user')

const {MONGOURI} = require('./keys');

require('./model/user')
require('./model/post')
app.use(express.json())
app.use('/',router)
app.use('/',postrouter)
app.use('/',userrouter)


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
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