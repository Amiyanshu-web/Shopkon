import React from 'react'
import {useNavigate} from 'react-router-dom';
import "./header.css";
import { useDispatch,useSelector } from 'react-redux';
import { Navbar,Nav,Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../actions/userActions';
// import logo from "../../public/logo.png";
const Header = () => {
  const history=useNavigate();
    const dispatch=useDispatch();
    const userLogin=useSelector(state=>state.userLogin);

    const{userInfo}=userLogin;
    const logoutHandler=()=>{
      dispatch(logout())
      history('/');

    }
    return (
        <header>
            <Navbar bg="info "   expand="lg" collapseOnSelect>
  <Container>
    <LinkContainer to="/">
              <Navbar.Brand >
                
                <svg fill="#000000" width="25px" height="30px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="m 9.8075842,8.125795 c -0.047226,-0.0818 -0.1653177,-0.0818 -0.2125819,-2e-5 l -2.7091686,4.69002 c -0.047101,0.0815 0.011348,0.18406 0.1055111,0.18419 0.00288,0 0.00577,0 0.00866,0 1.7426489,0 3.3117022,-0.74298 4.4078492,-1.92938 0.03656,-0.0396 0.04318,-0.0983 0.01627,-0.14492 L 9.807592,8.125795 Z m -2.4888999,1.68471 -5.4097573,0.005 c -0.094226,8e-5 -0.1536307,0.10217 -0.1064545,0.18373 0.8246515,1.42592 2.2192034,2.4809 3.8722553,2.85359 0.052573,0.0119 0.1068068,-0.0117 0.1337538,-0.0583 l 1.6166069,-2.80007 c 0.047277,-0.0819 -0.011863,-0.18422 -0.1064042,-0.18411 z m 4.8812207,-5.80581 c -0.825356,-1.42976 -2.2234427,-2.48728 -3.8807595,-2.85911 -0.052561,-0.0118 -0.1067061,0.0117 -0.1336405,0.0584 l -1.6174875,2.80157 c -0.047252,0.0819 0.011813,0.18415 0.1063413,0.18412 l 5.4189662,-0.001 c 0.0942,-2e-5 0.153693,-0.10205 0.10658,-0.18365 z m 0.413678,1.12713 -3.2344588,0 c -0.094503,0 -0.1535677,0.10233 -0.1062909,0.18415 l 2.7089927,4.6888 c 0.04735,0.0819 0.165368,0.0815 0.212808,-3.1e-4 C 12.706741,9.120925 13,8.094715 13,7.000015 c 0,-0.62043 -0.09423,-1.2188 -0.269055,-1.7817 -0.01595,-0.0514 -0.06352,-0.0865 -0.117362,-0.0865 z M 7.0021135,1.000015 c -7.045e-4,0 -0.00142,0 -0.00213,0 -1.7423595,0 -3.311199,0.74275 -4.4073209,1.92881 -0.036558,0.0395 -0.043188,0.0983 -0.016254,0.14494 l 1.6162797,2.79947 c 0.047264,0.0819 0.1654436,0.0818 0.2126575,-9e-5 l 2.7023877,-4.6891 c 0.04695,-0.0815 -0.011498,-0.18401 -0.1056242,-0.18403 z m -5.6144011,7.87237 3.2356039,0 c 0.094503,0 0.1535552,-0.10231 0.106291,-0.18416 L 2.0185518,3.994515 c -0.047327,-0.082 -0.1653304,-0.0816 -0.2127959,3e-4 C 1.2933853,4.878505 1,5.904985 1,7.000015 c 0,0.62198 0.094717,1.22181 0.2703885,1.78596 0.01599,0.0514 0.063518,0.0864 0.1173239,0.0864 z" /></svg>
                &nbsp;
                <span style={{color:"black"}}>ShopKon</span>
                </Navbar.Brand>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav  className="left ">
        <LinkContainer to="/cart">
        <Nav.Link href="/cart"><i className="fas fa-shopping-cart px-2"></i>Cart</Nav.Link>
        </LinkContainer>
        {userInfo ? (
                <NavDropdown title={userInfo.name?userInfo.name:'unknown'} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item><i className="fas fa-user-alt px-2"/>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt px-2"/>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
        {/* {
          userInfo?(
          <NavDropdown title={userInfo.name} id='username'>
            <LinkContainer to="/profile">
              <NavDropdown.Item><i className="fas fa-user-alt px-2"/>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}><i className="fas fa-sign-out-alt px-2"/>Logout</NavDropdown.Item>
          </NavDropdown>):
          <LinkContainer to="/login">
        <Nav.Link href="/login"><i className="fas fa-sign-in-alt px-2">Sign In</i></Nav.Link>
        </LinkContainer>
        } */}
        
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
        </header>
    )
}

export default Header
