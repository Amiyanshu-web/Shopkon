import express from 'express';
import env from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
// import products from './data/products.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cors from 'cors';

const app = express();
env.config();
connectDB();

app.use(express.json());

//sanitize data
app.use(mongoSanitize());
//set security headers
app.use(helmet());
//prevent xss attacks
app.use(xss());
//prevent http param pollution
app.use(hpp());
//cors origin
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running ...');
})
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
})


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));