import React from 'react'
import {useNavigate} from 'react-router-dom';
import "./header.css";
import { useDispatch,useSelector } from 'react-redux';
import { Navbar,Nav,Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../actions/userActions';
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
    <Navbar.Brand >ShopKon</Navbar.Brand>
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
