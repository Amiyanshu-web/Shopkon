import React from 'react'
import { Link,useParams,useNavigate } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux';
import { Row,Col,Image,ListGroup,Card,Button, Form } from 'react-bootstrap'
// import products from '../products'
import axios from 'axios';
import Rating from '../component/Rating'
import { listProductDetails } from '../actions/productActions';
import Loader from '../component/Loader';
import Message from '../component/Message';
import { addToCart } from '../actions/cartActions';
const Productscreen = () => {
    const dispatch=useDispatch();
    const history=useNavigate();
    const {id} = useParams();
    const [qty,setQty]=React.useState(1);
    const count=[1,2,3,4,5];

    const {product,loading,error}=useSelector(state=>state.productDetails);
    // product = product.product;
    // const [product,setProduct]=React.useState();
    // const[loading,setLoading]=React.useState(true);
    // React.useEffect(()=>{
    //     axios.get(`${process.env.REACT_APP_PROXY}/api/products/${id}`)
    //     .then(res=>{
    //         setProduct(res.data.product)
    //         setLoading(false)
    
    //     })
    //     .catch(err=>console.log(err.response.data))
    // },[id])

    React.useEffect(()=>{
        const fetchProduct = async(id)=>{
            try{
                dispatch(listProductDetails(id));
                // setProduct(productDetail.product);
                console.log(product);
            }
            catch(err){
                console.log(err.response.data)
            }
        };

        fetchProduct(id);
    },[id])
    
    const cartHandler=async()=>{
        try{

            dispatch(addToCart(id,qty));
            // history(`/cart/${id}?qty=${qty}`)
            history(`/cart`);
        }
        catch(err){
            console.log("Something went wrong!");
        }
    }
    return (
        
     
        <>
        <Link className='btn btn-light my-3'  to='/'><i className="fas fa-arrow-left pr-2"></i>Back to Products </Link>
        {/* {loading?<Loader/>:error?(<Message variant='danger'>{error}</Message>): */}
        {loading?<Loader/>:
        <Row>
            <Col md={6}>
                <Image className='my-5' src={product.image} fluid alt={product.name}/>
                </Col>
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <strong>{product.name}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating value={product.rating} text= {`${product.numReviews} reviews`}/>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>₹{product.price}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p> {product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price</Col>

                                <Col><strong>₹ {product.price}</strong>
                                </Col>
                                </Row>
                                
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                       <Col>Status:</Col>
                                        <Col>{product.countInStock>0 ? 'In Stock':'Out of Stock'}</Col>
                                    </Row>
                                    </ListGroup.Item>
                                    {product.countInStock>5 ?
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Quantity</Col>
                                            <Col>
                                            <Form.Control as='select' value={qty} onChange={(e)=>setQty(e.target.value)}>
                                                {count.map((c,i)=>(
                                                    <option key={i} value={c}>{c}</option>
                                                ))}
                                            </Form.Control>
                                            </Col>
                                            
                                            </Row>
                                    </ListGroup.Item>:
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Quantity</Col>
                                            <Col>
                                            <Form.Control as='select' value={qty} onChange={(e)=>setQty(e.target.value)}>
                                                {
                                                    [...Array(product.countInStock).keys()].map((c)=>(
                                                        <option key={c+1} value={c+1}>{c+1}</option>
                                                    ))
                                    }
                                            </Form.Control>
                                            </Col>
                                            
                                            </Row>
                                            </ListGroup.Item>
                                    }
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                        <Button className='btn btn-block pdt' type='button' onClick={cartHandler} disabled={product.countInStock===0}>ADD TO CART</Button>
                                        </Col>
                                        </Row>
                                        </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
        </Row>
        }
        
{/* } */}


            
           
        </>
    ) 
    
}

export default Productscreen
