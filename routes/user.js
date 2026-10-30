const User = require('../models/User');
const { verifyToken, verifyAuth, verifyAdmin } = require('./verifyToken');
const router = require('express').Router();

router.put('/:id', verifyAuth, async (req,res) => {
    if(req.body.password){
        req.body.passwor = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete('/:id', verifyAuth, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
}) 

router.get('/find/:id', verifyAdmin, async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get('/find', verifyAdmin, async (req,res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;