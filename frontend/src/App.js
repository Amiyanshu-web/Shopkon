import { lazy } from 'react';
import Container from 'react-bootstrap/Container'
import { Route, Routes } from 'react-router-dom'
import Footer from './component/Footer';
import Header from './component/Header';
import Cartscreen from './screens/Cartscreen';
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Registerscreen from './screens/Registerscreen';
import Productscreen from './screens/Productscreen';
import Profilescreen from './screens/Profilescreen';
import Shippingscreen from './screens/Shippingscreen';
// import PaymentScreen from './screens/PaymentScreen';
import PlaceOrder from './screens/PlaceOrder';
import Order from './screens/Order';
import PagenotFound from './screens/PagenotFound';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <>
      <Header />


      <main className='py-3'>
        <Container>
          <Routes>
            <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profilescreen />} />
            <Route path='/shipping' element={<Shippingscreen />} />
            {/* <Route path='/payment' element={<PaymentScreen />} /> */}
            <Route path='/order/:id' element={<Order />} />
            <Route path='/placeorder' element={<PlaceOrder />} />
            </Route>

            <Route path='/login' element={<Loginscreen />} />
            <Route path='/register' element={<Registerscreen />} />
            <Route path='/product/:id' element={<Productscreen />} />
            {/* <Route path='/cart/:id' element={<Cartscreen />} /> */}
            <Route path='/cart' element={<Cartscreen />} />
            <Route path='/' element={<Homescreen />} exact />
            <Route path='*' element={<PagenotFound />} />
          </Routes>
        </Container>
      </main>


      <Footer />
    </>
  )

}
export default App;
