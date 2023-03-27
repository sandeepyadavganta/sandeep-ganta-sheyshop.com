import React, { useContext, useEffect, useReducer } from 'react'
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { Store } from './Store';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'PAT_REQUEST':
            return{...state, loadingPay:true};
        case 'PAT_SUCCESS':
           return {...state, loadingPay:false, successPay:true};
        case 'PAT_FAIL':
            return{...state, loadingPay:false};   
        case 'PAY_RESET':
            return{...state,loadingPay:false, successPay:false}            
        default:
            return state;
    }
}

function OrderScreen() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;


    const [{ loading, order, error ,successPay,loadingPay}, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay:false,
        loadingPay:false,
    });

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

function createOrder(data, actions){
    return actions.order
    .create({
        purchase_units: [
            {
                amount:{value:order.totalPrice},
            }
        ]
    })
    .then((orderId)=>{
        return orderId
    })
};

function onApprove(data,actions){
    return actions.order.capture().then(async function (details){
        try {
          dispatch({type:'PAY_REQUEST',});
          const {data} = await axios.put(
            `/api/oredrs/${order._id}/pay`,
            details,
            {
                headers:{authorization: `Bearer ${userInfo.token}`}
            }
          );
          dispatch({type:'PAY_SUCCESS', payload:data});
             alert('order is paid')
        } catch (error) {
            dispatch({type: 'PAY_FAIL', payload:(error)})
        }
    })
};

function onError(err) {
    alert('error')
}

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    header: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });

            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: (error) })
            }
        }
        if (!userInfo) {
            return navigate('/login');
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({type:'PAY_RESET'});
            }
        } else {
            const loadPayPalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                })
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            loadPayPalScript();
        }

    }, [order, orderId, userInfo,successPay, navigate, paypalDispatch])

    return loading ?
        (
            <LoadingBox></LoadingBox>
        ) :
        error ? (
            <MessageBox variant="danger">(error)</MessageBox>
        ) :
            (<div className='container'>
                <title>order{orderId}</title>
                <h1 className='my-3'>order{orderId}</h1>
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Shipping</Card.Title>
                                <Card.Text>
                                    <strong>Name:<strong>
                                        {order.shippingAddress.fullname}</strong>
                                        <br />
                                        Address:
                                    </strong>{order.shippingAddress.address},
                                    {order.shippingAddress.city},{order.shippingAddress.postalcode},
                                    {order.shippingAddress.country}
                                </Card.Text>
                                {order.isDelivered ? (
                                    <h1>Delivered{order.deliveredAt}</h1>
                                ) : (
                                    <h1>not delivered</h1>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Payment</Card.Title>
                                <Card.Text><strong>method: {order.paymentMethod}</strong></Card.Text>
                                {order.isPaid ? (
                                   <h1> paid at{order.paidAt}</h1>
                                ) : (
                                    <h1>not paid</h1>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>
                                    Items
                                </Card.Title>
                                <ListGroup cariant="flush">
                                    {order.orderItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"></img>{''}
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
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
                                                <strong>Items</strong>
                                            </Col>
                                            <Col>${order.itemsPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>shipping price</strong></Col>
                                            <Col>${order.shippingPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>tax</strong></Col>
                                            <Col>
                                                <strong>${order.taxPrice.toFixed(2)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>order Total</strong></Col>
                                            <Col>
                                                <strong>${order.totalPrice.toFixed(2)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <LoadingBox />
                                        ) : (
                                            <div>
                                                <PayPalButtons createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}>
                                                </PayPalButtons>
                                            </div>
                                        )}
                                        {loadingPay && <LoadingBox></LoadingBox>}
                                    </ListGroup.Item>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>)

}


export default OrderScreen;