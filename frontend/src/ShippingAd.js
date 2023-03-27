import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { Store } from './Store';
export default function ShippingAd() {

  const navigator = useNavigate();
  const {state, dispatch:ctxDispatch} =useContext(Store);
  const {
    userInfo,
    cart :{shippingAddress},
  } = state;
const [fullname,setFullname] = useState(shippingAddress.fullname ||'');    
const [address,setAddress] = useState(shippingAddress.address ||'');   
const [city,setCity] = useState(shippingAddress.city ||'');   
const [postalcode,setPostalcode] = useState(shippingAddress.postalcode ||'');   
const [country,setCountry] = useState(shippingAddress.country ||''); 

const SubmitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type:'SAVE_SHIPPING_ADDRESS',
      payload:{
        fullname,
        address,
        city,
        postalcode,
        country
      }
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullname,
        address,
        city,
        postalcode,
        country,
      })
    );
    navigator('/payment');
}

useEffect(()=> {
  if (!userInfo) {
    navigator('/signin?redirect=/shipping')
  }
},[userInfo,navigator])

  return (
    <div className='container'>
        <h1 className='my-3'>Shipping Address</h1>
        <Form>
           <Form.Group className="mb-3" controlId="fullName">
             <Form.Label>Full Name</Form.Label>
             <Form.Control value={fullname} onChange={(e)=>setFullname(e.target.value)} required />
           </Form.Group>
           <Form.Group className="mb-3" controlId="fullName">
             <Form.Label>Address</Form.Label>
             <Form.Control value={address} onChange={(e)=>setAddress(e.target.value)} required />
           </Form.Group>
           <Form.Group className="mb-3" controlId="fullName">
             <Form.Label>City</Form.Label>
             <Form.Control value={city} onChange={(e)=>setCity(e.target.value)} required />
           </Form.Group>
           <Form.Group className="mb-3" controlId="fullName">
             <Form.Label>postal code</Form.Label>
             <Form.Control value={postalcode} onChange={(e)=>setPostalcode(e.target.value)} required />
           </Form.Group>
           <Form.Group className="mb-3" controlId="fullName">
             <Form.Label>country</Form.Label>
             <Form.Control value={country} onChange={(e)=>setCountry(e.target.value)} required />
           </Form.Group>
        </Form>
        <div className='mb-3'>
            <Button onClick={SubmitHandler} variant="primary" type="submit">
                continue
            </Button>
        </div>
    </div>
  )
}
