import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form,Button } from 'react-bootstrap';
import FormContainer from '../component/FormContainer';
import { useDispatch,useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import {CheckoutSteps} from '../component/CheckoutSteps';
const Shippingscreen = () => {
  const history=useNavigate();
    const dispatch=useDispatch();
     const cart = useSelector((state) => state.cart)
      const { shippingAddress } = cart;
     
    const [address,setAddress]=useState(shippingAddress.address);
    const [city,setCity]=useState(shippingAddress.city);
    const [postalCode,setPostalCode]=useState(shippingAddress.postalCode);
    const [country,setCountry]=useState(shippingAddress.country);
    const submitHandler=(e)=>{
      e.preventDefault();
      dispatch(saveShippingAddress({address,city,postalCode,country}));
      history('/payment');
      // console.log(address,city,postalCode,country);
    }
  return(
      <FormContainer>
      <CheckoutSteps step1={true} step2={true} step3={false} step4={false}/>
      <h1>Shiping</h1>
      <Form onSubmit={submitHandler} className='text-align-center'>
            <Form.Group controlId='address' className='my-2'>
            <Form.Label >&nbsp; Address </Form.Label>
            <Form.Control type='address' placeholder='Enter address' value={address} onChange={(e)=>setAddress(e.target.value)} required></Form.Control>
            </Form.Group>
              <Form.Group controlId='city' className='my-2'>
            <Form.Label > &nbsp;City </Form.Label>
            <Form.Control type='city' placeholder='Enter city' value={city} onChange={(e)=>setCity(e.target.value)} required></Form.Control>
            </Form.Group>
              <Form.Group controlId='postalCode' className='my-2'>
            <Form.Label > &nbsp; PostalCode </Form.Label>
            <Form.Control type='postalCode' placeholder='Enter PostalCode' value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} required></Form.Control>
            </Form.Group>
              <Form.Group controlId='country' className='my-2'>
            <Form.Label >&nbsp; Country </Form.Label>
            <Form.Control type='country' placeholder='Enter country' value={country} onChange={(e)=>setCountry(e.target.value)} required></Form.Control>
            </Form.Group>
             <Button type='submit' variant='primary' className='my-2 sign'>
          Continue
        </Button>
      </Form>
      </FormContainer>
  ) 
};

export default Shippingscreen;
