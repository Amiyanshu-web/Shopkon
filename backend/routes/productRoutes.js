import express from 'express';
import asyncHandler from 'express-async-handler';
const router =express.Router();
import Product from '../models/productModel.js';


// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/',asyncHandler(async(req,res)=>{
    const products=await Product.find({})
    res.json(products)
    
}))

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public

router.get('/:id',asyncHandler(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if(product){
    res.json({
        message:'Handling GET requests to /products',
        product
    })}
    else{
        res.status(404)
        throw new Error('Product not found')
    }
}))

export default router;