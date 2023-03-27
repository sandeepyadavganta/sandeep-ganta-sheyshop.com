import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { Store } from './Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethod() {
  const navigate = useNavigate();
const {state,dispatch:ctxDispatch} = useContext(Store);

const{
    cart:{shippingAddress,paymentMethod},
}= state;

const [paymentMethodName, setPaymentMethod] = useState(
  paymentMethod || 'Paypol',
);

useEffect(()=>{
  if (!shippingAddress.address) {
    navigate('/shipping');
  }
},[shippingAddress,navigate])

const Submithandler =(e)=> {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div className='container small-container'>
        <title>
            payment method
        </title>
        <h1 className='my-3'>Payment Method</h1>
        <Form onSubmit={Submithandler}>
          <div className='mb-3'>
            <Form.Check 
            type="radio"
            id="Paypol"
            label="Paypol"
            value="Paypol"
            checked={paymentMethodName === 'Paypol'}
            onChange={(e)=>setPaymentMethod(e.target.value)}>
            </Form.Check>
          </div>
          <div className='mb-3'>
            <Form.Check 
            type="radio"
            id="Stripe"
            label="Stripe"
            value="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e)=>setPaymentMethod(e.target.value)}>
            </Form.Check>
          </div>
          <div>
            <Button type="submit">
                continue
            </Button>
          </div>
        </Form>
    </div>
  )
}
