import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';



// @route   GET /api/products
// @desc    Get all products
// @access  Public
export const getProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find({})
    res.json(products)
    
})


// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
export const getProductById=asyncHandler(async(req,res,next)=>{
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
})