import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap'
import Product from '../component/Product'
import axios from 'axios';
import { listProducts } from '../actions/productActions';
import Loader from '../component/Loader';
import InfiniteScroll from 'react-infinite-scroller';
import Message from '../component/Message';
const Homescreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products, page, pages } = productList;
    const [allProducts, setAllProducts] = useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch initial products
                dispatch(listProducts());
                const {data} = await axios.get(`${process.env.REACT_APP_PROXY}/api/products?page=1`);
                console.log(data);
                setAllProducts(data.products);
            } catch (error) {
                // Handle errors here
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

        const fetchMoreData = async() => {
            // Fetch more products when the user scrolls to the bottom
            if (page < pages) {
                await dispatch(listProducts(parseInt(page) + 1));
                
                setAllProducts(prev =>[...prev,...products]);
            }
        };

    console.log(allProducts);
    console.log(products);
    return (
        <>
            <h1>Latest Products</h1>
            {/* {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : */}
                {/* ( */}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={fetchMoreData}
                        hasMore={page < pages}
                        loader={<Loader/>}
                    >
                        <Row>
                            {allProducts.map((product) => (
                                <Col key={product._id} md={6} lg={3} xl={4} sm = {12}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    </InfiniteScroll>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>:""};
                {/* )  */}
            {/* }  */}

        </>
    )
}

export default Homescreen
