 import mongoose from 'mongoose';

 const reviewSchema=new mongoose.Schema({
     name:{type:String,required:true},
     rating:{type:Number,required:true},
        comment:{type:String,required:true},
 },{timestamps:true})
const productSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true
    },
    
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true

    },
    countInStock:{
        type:Number,
        required:true
    },
    reviews:[reviewSchema],
    rating:{
        type:Number,
        default:0,
        required:true
    },
    numReviews:{
        type:Number,
        required:true,
        default:0
    }
},{
    timestamps:true  //created at and updated at filled automatically
})

const Product=mongoose.model('Product',productSchema);

export default Product;