import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from "./HomeScreen";
import ProductScreen from './ProductScreen';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useContext } from 'react';
import { Store } from './Store';
import Cart from './Cart';
import Signin from './Signin';
import ShippingAd from './ShippingAd';
import Signup from './Signup';
import PaymentMethod from './PaymentMethod';
import PlaceOrder from './PlaceOrder';
import OrderScreen from './OrderScreen';


function App() {
  const { state,dispatch:ctxDispatch } = useContext(Store)
  const { cart,userInfo} = state;

const signoutHandler = () => {
  ctxDispatch({type: 'USER_SIGNOUT'});
  localStorage.removeItem('userInfo');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');

}

  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
  <Link className="navbar-brand text-white" to="/">SheyShop</Link>
 
  <div className="">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <Link className="nav-link text-white" to="/cart">cart  {cart.cartItems.length > 0 && (
          <Badge pill bg='danger'>
            {cart.cartItems.reduce((a ,c)=> a+c.quantity, 0)}
          </Badge>)}</Link>
      </li>
      <li class="nav-item">
      {userInfo ? (
          <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
            <Link to="/profile">
              <NavDropdown.Item>User Profile</NavDropdown.Item>
            </Link>
            <Link>
            <NavDropdown.Item>Order History</NavDropdown.Item>
            </Link>
            <NavDropdown.Divider />
            <Link className='dropdown-item bg-primary' to="#signout" onClick={signoutHandler}>
                Signout  
            </Link>
          </NavDropdown>
        ):(
          <Link className='nav-link text-white' to="/signin">
          signin
          </Link>
          
        )}
      </li>
    
    </ul>
  </div>
</nav>
        </header>
        <main>
          <div className='container-mt-3'>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path='/shipping' element={<ShippingAd />} />
              <Route path='/payment' element={<PaymentMethod />} />
              <Route path='/placeorder' element={<PlaceOrder />} />
              <Route path='/order/:id' element={<OrderScreen />} />
            </Routes>
          </div>
        </main>
        <footer>
          <div className='text-center'>All Rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
