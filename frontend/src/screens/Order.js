import React, { useEffect } from 'react';
import axios from 'axios';
import { Col, ListGroup, Row, Image, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../component/Loader';
import { Link } from 'react-router-dom';
import Message from '../component/Message';
import NumberFormat from 'react-number-format';
import { Card } from 'react-bootstrap';
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { PayPalButton } from 'react-paypal-button-v2';

const Order = ({ match }) => {
    const orderId = window.location.pathname.split('/')[2];

    const [sdkReady, setSdkReady] = React.useState(false);
    const dispatch = useDispatch();
    // console.log(orderId);
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay



    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
        // order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    }

    useEffect(() => {
        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            console.log(clientId);
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=IND`;
            script.async = true;
            script.onLoad = () => {
                setSdkReady(true);
            }
            document.body.appendChild(script);
        }

        // addPaypalScript();
        if (!order || successPay) {
            dispatch({ type: "ORDER_PAY_RESET" })
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPaypalScript();
                setSdkReady(true);
            }
            else {
                setSdkReady(true);
            }
        }

    }, [dispatch, orderId, order, successPay])

    const successPaymentHandler = (data) => {
        console.log(data);
        dispatch(payOrder(orderId, data));
    }
    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
        <>
            <h1>{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong>{order.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong>{order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2> Payment Method </h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items: </h2>
                            {order.orderItems.length === 0 ? <Message variant='danger'>Order is empty</Message> :
                                (<ListGroup variant='flush'>
                                    {order.orderItems.map(item => (
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
                                        value={order.itemsPrice}
                                        // value="100"
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
                                        value={order.shippingPrice}
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
                                        value={order.taxPrice}
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
                                        value={order.totalPrice}
                                        prefix="₹"
                                        decimalSeparator="."
                                        displayType='text'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        decimalScale={2}
                                    /></Col>
                                </Row>
                            </ListGroup.Item>
                            {/* //paypal button integration */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )

                            }
                        </ListGroup>
                    </Card>

                </Col>
            </Row>
        </>
};

export default Order;
