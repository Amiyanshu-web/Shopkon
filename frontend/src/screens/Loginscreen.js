import React,{useEffect,useState} from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import {Form,Button,Col,Row,Container} from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import Loader from '../component/Loader';
import Message from '../component/Message';
import FormContainer from '../component/FormContainer';
import { login,googleLogin } from '../actions/userActions';
import { GoogleLogin } from 'react-google-login';
const Loginscreen = () => {
    const history=useNavigate();
    const location=useLocation();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const dispatch=useDispatch();
    const userLogin=useSelector(state=>state.userLogin);
    const{loading,error,userInfo}=userLogin;
    const redirect=location.search?location.search.split('=')[1]:'/';

    useEffect(()=>{
        if(userInfo){
            history(`${redirect}`);
        }
    },[userInfo,history,redirect])
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(login(email,password));

    }
    const googleSuccess = async (res) => {
    // const result = res?.profileObj;
    const token = res?.tokenId;

    // try {
    //   dispatch(  login( result.email,token  )  );

    //   history('/');
    // } catch (error) {
    //   console.log(error);
    // }
    // const config={
    //         headers:{
    //             'Content-Type':'application/json'
    //     }
    // }
    // await axios.post('http://localhost:5000/api/users/googlelogin', {
      
    //   tokenId:token
    // },config)
    // console.log(res.tokenId);
    dispatch(googleLogin(token));
    // history('/');
  };

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

  return (
      
    <FormContainer>
        <h1>SIGN IN</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler} className='text-align-center'>
        <Form.Group controlId='email'>
            <Form.Label >Email Address </Form.Label>
            <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
            <Form.Label >Password: </Form.Label>
            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit' className='primary my-2 sign'>Sign In</Button>
            {/* <span className='m-50vw'>OR</span> */}
            {/* <GoogleLogin
            clientId="287391644614-kc8nbmutmfq5kh30u010v58s86j1h46u.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className='primary my-2' color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled}  >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          /> */}
          {/* <GoogleLogin
          className='primary my-2 google '
    clientId="287391644614-kc8nbmutmfq5kh30u010v58s86j1h46u.apps.googleusercontent.com"
    buttonText="Login with Google"
    onSuccess={googleSuccess}
    onFailure={googleError}
    cookiePolicy={'single_host_origin'}
  /> */}
        </Form>
        <Row className='py-3'> 
            <Col>
            New User? <Link to={redirect?`/register?redirect=${redirect}`:'/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
    )
};

export default Loginscreen;
