import express from 'express';
import { authenticateUser, authUser, getUserProfile, registerUser, updateUserProfile} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router =express.Router();

router.route('/').post(registerUser);
router.post('/login',authUser);
// router.post('/googlelogin',googleAuthUser);
router.post('/googlelogin',authenticateUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);


export default router;