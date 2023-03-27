const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRouter = require('./routes/productRoutes.js');
const userRoute = require('./routes/userRoute.js');
const Router = require('./routes/OrderRoutes.js');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('connect to db')
}).catch(err=>{
    console.log(err.message);
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/keys/paypal',(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.use('/api/products',productRouter);
app.use('/api/users',userRoute);
app.use('/api/orders',Router);


app.use( (err,req,res,next)=>{
    res.status(500).send({message:err.message});
} )

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server runnoing ${port}`)
})