import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating';
import NumberFormat from "react-number-format"
import "./Product.css";
const Product = ({product}) => {
    return (
        <Link to={`/product/${product._id}`}>

        <div className= "cardd my-3 p-3 rounded">
            <div className="imgBox">
                <img src = {product.image} alt = "product" className="product"/>
            </div>

            <div className="contentBox">
                <strong style={{color:"black"}}>{product.name}</strong>
                <h3 className='price'>
                    <NumberFormat
                                 thousandsGroupStyle="lakh"
                    value={product.price}
                    prefix="₹"
                    decimalSeparator="."
                    displayType='text'
                    thousandSeparator={true}
                    allowNegative={false}
                     />
                </h3>
                <div className='my-1'><Rating value={product.rating} text={`${product.numReviews} reviews`} /></div>
                <Link to = {`/product/${product._id}`}>
                    <button className = "buy">
                        Buy Now
                    </button>
                </Link>
            </div>
        </div>
        </Link>
    )
}

export default Product;
