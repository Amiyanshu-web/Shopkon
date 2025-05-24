import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form,Button,Col } from 'react-bootstrap';
import FormContainer from '../component/FormContainer';
import { useDispatch,useSelector } from 'react-redux';
import { savePaymentMethod, saveShippingAddress } from '../actions/cartActions';
import {CheckoutSteps} from '../component/CheckoutSteps';
const PaymentScreen = () => {
const history=useNavigate();
    const dispatch=useDispatch();
     const cart = useSelector((state) => state.cart)
      const { shippingAddress } = cart;
     if(!shippingAddress){
         history('/shipping');
     }
    const [paymentMethod,setPaymentMethod]=useState('Paypal');
    
    const submitHandler=(e)=>{
      e.preventDefault();
      dispatch(savePaymentMethod(paymentMethod));
      history('/placeorder');
      // console.log(address,city,postalCode,country);
    }
  return(
      <FormContainer>
      <CheckoutSteps step1={true} step2={true} step3={true} step4={false}/>
      <h1>Payment</h1>
      <Form onSubmit={submitHandler} className='text-align-center'>
            <Form.Group controlId='address' className='my-2'>
            <Form.Label as='legend'> Select Method </Form.Label>
            </Form.Group>
             <Col className='mx-2'>
             <Form.Check inline label='Paypal or Credit Card' type='radio' name='paymentMethod' value='Paypal' onChange={(e)=>setPaymentMethod(e.target.value)} required></Form.Check>
             </Col>
             <Col className='mx-2'>
             <Form.Check inline label='UPI' type='radio' name='paymentMethod' value='UPI' onChange={(e)=>setPaymentMethod(e.target.value)} disabled></Form.Check>
             </Col>
             <Button type='submit' variant='primary' className='my-2 '>
          Continue
        </Button>
      </Form>
      </FormContainer>
  )
};

export default PaymentScreen;




