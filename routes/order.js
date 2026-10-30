const Order = require('../models/Order');
const { verifyToken, verifyAuth, verifyAdmin } = require('./verifyToken');
const router = require('express').Router();


router.post('/create', verifyToken, async (req,res) => {
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
})

router.put('/:id', verifyAuth, async (req,res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete('/:id', verifyAuth, async (req,res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
}) 

router.get('/find/:userid', verifyAuth, async (req,res) => {
    try{
        const order = await Order.find({userId: req.body.userid});
        res.status(200).json(order);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get('/find', verifyAdmin, async (req,res) => {
    try{
        const orders = await PrOrderoduct.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;