import React, { useEffect } from 'react';
import { Col, ListGroup, Row, Image, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CheckoutSteps } from '../component/CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../component/Message';
import NumberFormat from 'react-number-format';
import { Card } from 'react-bootstrap';
import { createOrder } from '../actions/orderActions'

const PlaceOrder = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2)

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const placeHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            })
        )



    }

    useEffect(() => {
        if (success) {
            // window.location.href = `/order/${order._id}`;
            navigation(`/order/${order._id}`);
        }
        //eslint-disable-next-line
        Message('success', 'Order placed successfully');


    }, [success])
    return (
        <>
            <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2> Payment Method </h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items: </h2>
                            {cart.cartItems.length === 0 ? <Message variant='danger'>Please add items to cart</Message> :
                                (<ListGroup variant='flush'>
                                    {cart.cartItems.map(item => (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col >
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}> <NumberFormat
                                                    thousandsGroupStyle="lakh"
                                                    value={item.price}
                                                    prefix="₹"
                                                    decimalSeparator="."
                                                    displayType='text'
                                                    thousandSeparator={true}
                                                    allowNegative={false}
                                                /> X {item.qty}   =<NumberFormat
                                                        thousandsGroupStyle="lakh"
                                                        value={item.price * item.qty}
                                                        prefix="₹"
                                                        decimalSeparator="."
                                                        displayType='text'
                                                        thousandSeparator={true}
                                                        allowNegative={false}
                                                    /> </Col>


                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>

                    <Card>
                        <ListGroup variant='flush'>
                            <h1 className='p-2'>Order Summary</h1>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col><NumberFormat
                                        thousandsGroupStyle="lakh"
                                        value={cart.itemsPrice}
                                        prefix="₹"
                                        decimalSeparator="."
                                        displayType='text'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        decimalScale={2}
                                    /></Col>

                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col><NumberFormat
                                        thousandsGroupStyle="lakh"
                                        value={cart.shippingPrice}
                                        prefix="₹"
                                        decimalSeparator="."
                                        displayType='text'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        decimalScale={2}
                                    /></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col><NumberFormat
                                        thousandsGroupStyle="lakh"
                                        value={cart.taxPrice}
                                        prefix="₹"
                                        decimalSeparator="."
                                        displayType='text'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        decimalScale={2}
                                    /></Col>

                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><NumberFormat
                                        thousandsGroupStyle="lakh"
                                        value={cart.totalPrice}
                                        prefix="₹"
                                        decimalSeparator="."
                                        displayType='text'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        decimalScale={2}
                                    /></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            <Button variant='primary mx-2 my-2' disabled={cart.cartItems === 0} onClick={placeHandler}><strong>PLACE ORDER</strong></Button>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrder;
