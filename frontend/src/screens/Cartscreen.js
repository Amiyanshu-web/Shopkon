import React from 'react'
import { useParams,useNavigate,useLocation,useSearchParams,Link } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux';
import { Row,Col,Image,ListGroup,Card,Button, Form } from 'react-bootstrap'
// import { cartReducer } from '../reducers/cartReducers';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Message from '../component/Message';
const Cartscreen = () => {
   const { id } = useParams();
//   const { search } = useLocation();
const history = useNavigate();
const [searchParms] = useSearchParams();
const qty = Number(searchParms.get("qty"));
  const productId = id;
  console.log({productId,qty});
//   const qty = search ? Number(search.split("=")[1]) : 1;
    const dispatch=useDispatch();
     const cart = useSelector((state) => state.cart)
  const { cartItems } = cart;
    React.useEffect(() => {
        if(productId){
            dispatch(addToCart(productId,qty));
        }
    }, [dispatch,productId,qty]);
    const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history('/login?redirect=shipping')
  }
    return (
        <Row>
          <Col md={8}>
            <h1>My Cart</h1>
            {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>₹{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='danger'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
          <Col md={4}>
            <Card>
              <Card.Header>Order Summary</Card.Header>
              <Card.Body>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                   <h2> SUBTOTAL ( {cartItems.reduce((a, c) => a + c.qty, 0)} ITEMS)</h2>
                        <strong>₹{cartItems.reduce((acc,item)=>acc+item.price*item.qty,0)}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button type='button' className='btn-block' disabled={cartItems.length===0} onClick={()=>checkoutHandler()}>Procced to Checkout</Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
          </Col>
        </Row>
    )
}

export default Cartscreen
