const Cart = require('../models/Cart');
const { verifyToken, verifyAuth, verifyAdmin } = require('./verifyToken');
const router = require('express').Router();


router.post('/create', verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
})

router.put('/:id', verifyAuth, async (req,res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete('/:id', verifyAuth, async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
}) 

router.get('/find/:userid', verifyAuth, async (req,res) => {
    try{
        const cart = await Cart.find({userId: req.body.userid});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get('/find', verifyAdmin, async (req,res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;