const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel.js') ;
const orderRouter = express.Router();
const isAuth =require('../routes/userRoute');

orderRouter.post(
    '/',isAuth, async  (req, res) =>{
        const newOrder =new Order({
            orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,    
            totalPrice: req.body.totalPrice,
            paidAt:req.body.paidAt,
            isDelivered:req.body.isDelivered,
        });
        const order = await newOrder.save();
        res.status(201).send({ message: 'new order created', order });
    });

    orderRouter.get(
        '/:id',isAuth,( async  (req, res) =>{
            const order = await Order.findById(req.params.id);
            if (order) {
                res.send(order)
            }else{
                res.status(401).send({message:'order not found'})
            }

        })
        );

 orderRouter.put('/:id/pay',isAuth,(async (req,res)=>{
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status:req.body.status,
            update_time: req.body.update_time,
            email_address:req.body.email_address,
        };
        const updateOrder = await order.save();
        res.send({message:'order paid,',order:updateOrder})
    }else{
        res.status(404).send({message:'order not paid'})
    }
 }))       



module.exports = orderRouter;