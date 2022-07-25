import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating';
import NumberFormat from "react-number-format"
const Product = ({product}) => {
    return (
        <div>
            <Card className='my-3 p-3 rounded'>
                <Link to={`/product/${product._id}`}>
                <Card.Img variant="top" src={product.image} />
                </Link>
                <Card.Body >
                    <Link to={`/product/${product._id}`}>
                <Card.Title as='div'><strong>{product.name}</strong></Card.Title>
                </Link>    
                <Card.Text as='div'><div className='my-3'><Rating value={product.rating} text= {`${product.numReviews} reviews`}/></div></Card.Text>
                <Card.Text as='h3'><div className='my-3'>
                    <NumberFormat
                     thousandsGroupStyle="lakh"
        value={product.price}
        prefix="₹"
        decimalSeparator="."
        displayType='text'
        thousandSeparator={true}
        allowNegative={false}
         />
                </div></Card.Text>
                    {/* ₹{product.price}</div></Card.Text> */}
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product
