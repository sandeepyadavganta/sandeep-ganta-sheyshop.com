import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { Store } from './Store';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, product: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
  
    }
  }
  
function ProductScreen() {
 
    const params = useParams();
    const {slug} = params;
    const navigate = useNavigate();

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true, error: ''
      })
      useEffect(() => {
        const fetchData = async () => {
          dispatch({ type: 'FETCH_REQUEST' });
          try {
            const result = await axios.get(`/api/products/slug/${slug}`)
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: err.message });
          }
    
    
        };  
        fetchData();
      }, [slug])
      const {state, dispatch:ctxDispatch} = useContext(Store);
      const {cart} =state;
     const addToCartHandler = async() =>{
     const existItem = cart.cartItems.find((x)=> x._id === product._id);
     const quantity = existItem ? existItem.quantity +1 : 1;
     const {data} = await axios.get(`/api/products/${product._id}`);
     if (data.countInStock < quantity) {
       window.alert('sorry.product is out of stock');
       return;
     }
     ctxDispatch({
      type:'CART_ADD_ITEM',
      payload:{...product, quantity}
    });
        navigate('/cart');
     }

    return(
        loading? <div>
            Loading
        </div>:error?<div>
            {error}
        </div>:
        <div className='container'>
            <Row>
                <Col md={6}>
                    <img className='img-large'
                    src={product.image}
                    alt={product.name}/>
                </Col>
                <Col md={3}>
                    <ListGroup varaint="flush">
                      <ListGroup.Item>
                        <h1>{product.name}</h1>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Price : Rs {product.price}
                      </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                          <ListGroup variant="flush">
                             <ListGroup.Item>
                                <Row>
                                    <Col>Price :</Col>
                                    <Col>RS {product.price}/-</Col>
                                </Row>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                <Row>
                                    <Col>Status :</Col>
                                    <Col>
                                       stac in
                                    </Col>
                                </Row>
                             </ListGroup.Item>
                             {product.countINStock > 0 && (
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                       <Button onClick={addToCartHandler}>Add TO CArt</Button>
                                    </div>
                                </ListGroup.Item>
                             )}
                          </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
  
}

export default ProductScreen