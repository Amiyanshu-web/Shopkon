import React from 'react'
import {useDispatch,useSelector} from 'react-redux';
import { Row,Col } from 'react-bootstrap'
import Product from '../component/Product'
import axios from 'axios';
import { listProducts } from '../actions/productActions';
import Loader from '../component/Loader';
import Message from '../component/Message';
const Homescreen = () => {
    // const [products,setProducts]=React.useState([]);
    // React.useEffect(()=>{
    //     const fetchData = async () => {
    //         const {data}=await axios.get('/api/products');
    //         setProducts(data);
    //     }
    //     fetchData()}
    // ,[])
    const dispatch=useDispatch();
    const productList=useSelector(state=>state.productList);
    const {loading,error,products}=productList;
    React.useEffect(()=>{
        dispatch(listProducts());
    },[dispatch])

    return (
        <>
            <h1>Latest Products</h1>
            {loading ? <Loader/>:error?<Message variant='danger'>{error}</Message>:
            <Row>
            {products.map(product => (
                (
                    <Col key={product._id} sm={12} md={6} lg={4}  xl={3}>
                        <Product product={product}/> 
                        </Col>
                )
            ))}
            </Row>  }
            
        </>
    )
}

export default Homescreen
