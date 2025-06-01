import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap'
import Product from '../component/Product'
import axios from 'axios';
import { listProducts } from '../actions/productActions';
import Loader from '../component/Loader';
import InfiniteScroll from 'react-infinite-scroller';
import Message from '../component/Message';
import ChatBot from '../component/ChatBot';
const Homescreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products, page, pages, answer } = productList;
    const [allProducts, setAllProducts] = useState([]);
    const [botAnswer, setBotAnswer] = useState({}); 
    const [userQuery, setUserQuery] = useState("");
    
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch initial products
                dispatch(listProducts());
                // const {data} = await axios.get(`${process.env.REACT_APP_PROXY}/api/products?page=1`);
                console.log("Products", products);
                // console.log("Data", data.products);
                setAllProducts(products);
                // setAllProducts(data.products);
            } catch (error) {
                // Handle errors here
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    // React.useEffect(() => {
    //     const fetchBotAnswer = async () => {

    //         if (userQuery) {
    //             try{
    //                 dispatch(listProducts(userQuery));
    //                 setAllProducts(products);
    //             }
    //             catch (error) {
    //                 console.error('Error fetching bot answer:', error);
    //                 setBotAnswer("Sorry, I couldn't find an answer to your query.");
    //             }
    //         }
    //     };
    //     fetchBotAnswer();
    //     // if (answer) {
    //     console.log("Bot Answer", answer);
    //     setBotAnswer(answer);
    //     // }
    // }, [userQuery]);
    useEffect(() => {
        if (userQuery) {
            dispatch(listProducts(userQuery,1));
        }
    }, [userQuery, dispatch]);

    useEffect(() => {
        if (page === 1) {
            setAllProducts(products || []);
            console.log("Answer", answer);
            setBotAnswer({id:Date.now(),answer});
        } 
    }, [products, page, answer]);


    const fetchMoreData = async() => {
        // Fetch more products when the user scrolls to the bottom
        if (page < pages) {
            dispatch(listProducts(userQuery, parseInt(page) + 1));
            
            setAllProducts(prev =>[...prev,...products]);
        }
    };

    const handleUserQuery = (query) => {
        setUserQuery(query);
        };

    // console.log(allProducts);
    // console.log(products);
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
            <ChatBot
                botAnswer={botAnswer}
                onUserQuery={handleUserQuery}
            />
        </>
    )
}

export default Homescreen
