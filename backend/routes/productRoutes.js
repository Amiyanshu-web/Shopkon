import express from 'express';
import { getProductById, getProducts, createProductReview } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
const router =express.Router();


router.route('/').get(getProducts);


router.route('/:id').get(getProductById)

router.route('/:id/review').post(protect, createProductReview);

export default router;