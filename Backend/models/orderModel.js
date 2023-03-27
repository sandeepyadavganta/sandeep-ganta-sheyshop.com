const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderItems:[
            {
                slug:{type:String,required:true},
                name:{type:String,required:true},
                quantity:{type:Number,required:true},
                image:{type:String,required:true},
                price: {type:Number,required:true},
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                    required:true,
                },
            },
        ],
        shippingAddress:{
            fullname:{type:String,required:true},
            address:{type:String,required:true},
            city:{type:String,required:true},
            postalCode:{type:Number},
            country:{type:String,required:true},
        },
        paymentMethod:{type:String,required:true},
        paymentResult:{
            id:String,
            status:String,
            update_time:String,
            email_address:String,
        },
        itemsPrice:{type:Number,required:true},
        shippingPrice:{type:Number,required:true},
        taxPrice:{type:Number,required:true},
        totalPrice:{type:Number,required:true},
        isPaid:{type:Boolean,default:false},
        paidAt:{type:Date},
        isDelivered:{type:Boolean,default:false},
        deliveredAt:{type:Date},
        User:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    },
    {
        timestamps:true,
    }
)

const Order = mongoose.model('Order',orderSchema);
module.exports =Order;
