import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'10d'
    })
}

export default generateToken;