import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';



// @route   GET /api/products
// @desc    Get all products
// @access  Public
export const getProducts=asyncHandler(async(req,res)=>{
     const pageSize = 9; // Set the number of products per page
    const page = req.query.page || 1;

    try {
        const products = await Product.find()
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .exec();

        const count = await Product.countDocuments();

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
    
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

export const createProductReview = asyncHandler(async (req,res)=>{
    try{

        const {rating, comment} = req.body;
        
        const productId = req.params.id;
        
        const product = await Product.findById(productId);
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }
        product.reviews.push({
            name : req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        })

        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((curr, item) => item.rating + curr, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({
            message: 'Review added',
            review: {
                name : req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            }
        })
    }
    catch(error){
        res.status(500).json({ message: 'Server Error' });
    }
})