import React,{useEffect,useState} from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import {Form,Button,Col,Row,Container} from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import Loader from '../component/Loader';
import Message from '../component/Message';
import FormContainer from '../component/FormContainer';
import { register } from '../actions/userActions';
const Loginscreen = () => {
    const history=useNavigate();
    const location=useLocation();
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [message,setMessage]=useState('');
    const dispatch=useDispatch();
    const userRegister=useSelector(state=>state.userRegister);
    const{loading,error,userInfo}=userRegister;
    const redirect=location.search?location.search.split('=')[1]:'/';

    useEffect(()=>{
        if(userInfo){
            history(redirect);
        }
    },[userInfo,history,redirect])
    const submitHandler=(e)=>{
        e.preventDefault();
        if(confirmPassword!==password){
            setMessage('Passwords do not match');
        }
        dispatch(register(name,email,password));
    }
  return (
      
    <FormContainer>
        <h1>REGISTER</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler} className='text-align-center'>
            <Form.Group controlId='name'>
            <Form.Label >Name </Form.Label>
            <Form.Control type='name' placeholder='Enter name' value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
        <Form.Group controlId='email'>
            <Form.Label >Email Address </Form.Label>
            <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
            <Form.Label >Password: </Form.Label>
            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
            <Form.Label >Confirm Password: </Form.Label>
            <Form.Control type='confirm password' placeholder='Confirm password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit' className='primary my-2 sign'>Register</Button>
        </Form>
        <Row className='py-3'> 
            <Col>
            Already Registered? <Link to={redirect?`/login?redirect=${redirect}`:'/login'}>Login</Link>

            </Col>
        </Row>
    </FormContainer>
    )
};

export default Loginscreen;
