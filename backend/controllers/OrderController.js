import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';



// @route   POST /api/orders
// @desc    POST NEW products
// @access  PRIVATE
export const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    // res.json(products)

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order Items ')
        return
    }
    else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder);
    }

})

// @route   GET /api/orders/:id
// @desc    Get  products by id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.json(order)
    }
    else {
        res.status(404)
        throw new Error('Order not found')
    }
})

export const updateOrdertoPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)


    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }
        order.paymentMethod = 'Paypal'
        const updatedOrder = await order.save()

        res.json(updatedOrder)
    }
    else {
        res.status(404)
        throw new Error('Order not found')
    }

})

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })


    res.json(orders)

})