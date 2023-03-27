import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { Store } from './Store';
function Product(props) {
  const {product} = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

  const addteCartHandler =async (item)=>{
    const existItem = cartItems.find((x)=> x._id === product._id);
     const quantity = existItem ? existItem.quantity +1 : 1;
    const {data}= await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
        window.alert('sorry.product is out of stock');
        return;
      }
      ctxDispatch({
       type:'CART_ADD_ITEM',
       payload:{...item, quantity}
     })
}
  return(
    <Card>
    <img src={product.image} alt='not found' className="card-img-top" />
    <Card.Body>
    <Link to={`/product/${product.slug}`}>
        <Card.Title>
          {product.name}
        </Card.Title>
      </Link>
      <Card.Text>
      RS{product.price}/-
      </Card.Text>
      {product.countInStock === 0? <Button variant="light" disabled>Out of stock</Button>:
      (
        <Button onClick={()=>addteCartHandler(product)} >Add TO CArt</Button>
      )
      }
      
    </Card.Body>
  </Card>
  )
}
export default Product ;