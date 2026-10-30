const Product = require('../models/Product');
const { verifyToken, verifyAuth, verifyAdmin } = require('./verifyToken');
const router = require('express').Router();


router.post('/create', verifyAdmin, async (req,res) => {
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
})

router.put('/:id', verifyAdmin, async (req,res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete('/:id', verifyAdmin, async (req,res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
}) 

router.get('/find/:id', verifyAdmin, async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get('/find', verifyAdmin, async (req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;