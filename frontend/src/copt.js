{
    products.map(product => (
      <div key={product.slug} className="product">
        <img src={product.image} alt='not found' />
        <div className="product-info">
          <Link to={`/product/${product.slug}`}>
            <p>
              {product.name}
            </p>
          </Link>
          <p>
            <strong>
              RS{product.price}/-
            </strong>
          </p>

          <button>Add To Cart</button>
        </div>
      </div>
    ))}


    orderItems:req.body.orderItems.map((x)=> ({...x,product: x._id})),
    shippingAddress:req.body.shippingAddress,
    paymentMethod:req.body.paymentMethod,
    itemPrice:req.body.itemPrice,
    shippingPrice:req.body.shippingPrice,
    taxPrice:req.body.taxPrice,
    totalPrice:req.body.totalPrice,
    user:req.body._id,

    
    const order = await newOrder.save();
    res.status(201).send({message:'new order created',order})

    dispatch({type:'FETCH_FAIL',payload:(error)})

    case 'FETCH_FAIL':
                    return {...state,loading:false,error:action.payload};

                    import React, { useContext, useEffect, useReducer } from 'react'
                    import LoadingBox from './LoadingBox';
                    import MessageBox from './MessageBox';
                    import {Link, useNavigate,useParams} from 'react-router-dom';
                    import axios from 'axios';
                    import Card from 'react-bootstrap/Card';
                    import Row from 'react-bootstrap/esm/Row';
                    import Col from 'react-bootstrap/esm/Col';
                    import ListGroup from 'react-bootstrap/esm/ListGroup';
                    import { Store } from './Store';
                    
                    function reducer(state,action) {
                        switch(action.type) {
                            case 'FETCH_REQUEST':
                                return {...state,loading:true,error:''};
                                case 'FETCH_SUCCESS':
                                    return {...state,loading:false,order:action.payload,error:''};
                                        default:
                                            return state;
                        }
                    }
                    
                    function OrderScreen() {
                        const navigate = useNavigate();
                        const {state} = useContext(Store);
                        const {userInfo} = state;
                    
                        const params =useParams();
                        const {id: orderId} = params;
                    
                    
                    const [{loading,order,error},dispatch]= useReducer(reducer,{
                        loading:true,
                        order:{},
                        error:'',
                    });
                    
                    useEffect(()=> {
                        const fetchOrder = async () =>{
                            try {
                                dispatch({type:'FETCH_REQUEST'});
                                const {data} = await axios.get(`/api/orders/${orderId}`,{
                                header:{authorization:`Bearer ${userInfo.token}`},
                                });
                                dispatch({type:'FETCH_SUCCESS',payload:data});
                            } catch (error) {
                                console.log(error)
                            }
                        }
                     if (!userInfo) {
                        return navigate('/login');
                     }
                     if(!order._id || (order._id && order._id !== orderId)){
                        fetchOrder();
                     }
                     
                    },[order,orderId,userInfo,navigate])
                    
                      return ( loading?
                        (
                        <LoadingBox></LoadingBox>
                        ) :
                        error ?(
                            <MessageBox variant="danger">(error)</MessageBox>
                        ):
                        (<div>
                            <title>order{orderId}</title>
                            <h1 className='my-3'>order{orderId}</h1>
                            <Row>
                             <Col md={8}>
                                <Card className="mb-3">
                                <Card.Body>
                                     <Card.Title>Shipping</Card.Title>
                                     <Card.Text>
                                        <strong>NameL:{order.shippingAddress.fullname}</strong>
                                        <strong>Address:</strong>{order.shippingAddress.address},
                                        {order.shippingAddress.city},{order.shippingAddress.postalcode},
                                        {order.shippingAddress.country}
                                     </Card.Text>
                                      {order.isDelivered ?(
                                        <MessageBox variant="danger"></MessageBox>
                                      ):(
                                        <MessageBox variant="danger"> NOT delivered</MessageBox>
                                      )} 
                                </Card.Body>
                                </Card>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Payment</Card.Title>
                                        <Card.Text><strong>method: {order.paymentMethod}</strong></Card.Text>
                                        {order.isPaid ?(
                                            <MessageBox variant="success">paid at{order.paidAt}</MessageBox>
                                        ):(
                                            <MessageBox variant="danger">not paid</MessageBox>
                                        )}
                                    </Card.Body>
                                </Card>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>
                                            Items
                                        </Card.Title>
                                        <ListGroup cariant="flush">
                                           {order.orderItems.map((item)=>(
                                            <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                              <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"></img>{''}
                                                <Link t0={`/product/${item.slug}`}>{item.name}</Link>
                                              </Col>
                                              <Col md={3}>
                                                <span>{item.quantity}</span>
                                              </Col>
                                              <Col md={3}>
                                                   ${item.price}
                                              </Col>
                                            </Row>
                                            </ListGroup.Item>
                                           ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                             </Col>
                             <Col md={4}>
                                <Card className='mb-3'>
                                    <Card.Body>
                                        <Card.Title>order Summary</Card.Title>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                    Items
                                                    </Col>
                                                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Shipping</Col>
                                                    <Col>${order.shippingPrice}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col><strong>Order Total</strong></Col>
                                                    <Col>
                                                    <strong>${order.totalPrice.t0Find(2)}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                             </Col>
                            </Row>
                        </div>)
                      )
                    }
                    
                    
                    export default OrderScreen;



                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
    <a class="navbar-brand" href="#">Hidden brand</a>
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>


<nav class="navbar navbar-expand-lg navbar-light bg-dark">
  <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
    <Link className='text-decoration-none text-white' to="/">amazona</Link>
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
      {userInfo ? (
          <NavDropdown  title={userInfo.name} id="basic-nav-dropdown">
            <Link to="/profile">
              <NavDropdown.Item>User Profile</NavDropdown.Item>
            </Link>
            <Link>
            <NavDropdown.Item>Order History</NavDropdown.Item>
            </Link>
            <NavDropdown.Divider />
            <Link className='dropdown-item' to="#signout" onClick={signoutHandler}>
                Signout  
            </Link>
          </NavDropdown>
        ):(
          <Link className="nav-link text-white" to="/signin">
          signin
          </Link>
          
        )}
      </li>
      <li class="nav-item">
     
      </li>
      <li class="nav-item">
      <Link className='text-decoration-none text-white' to="/cart">Cart
        {cart.cartItems.length > 0 && (
          <Badge pill bg='danger'>
            {cart.cartItems.reduce((a ,c)=> a+c.quantity, 0)}
          </Badge>
        )}
        </Link>
      </li>
    </ul>
   
  </div>
</nav>