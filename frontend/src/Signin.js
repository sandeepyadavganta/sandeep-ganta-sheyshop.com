import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Store } from './Store';

function Signin() {
  const navigate = useNavigate();
  const {search} = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');

  const {state, dispatch:ctxDispatch} = useContext(Store);
  const {userInfo}= state

const submitHandler =async (e) =>{
  e.preventDefault();
  try {
    const {data} = await axios.post('/api/users/login',{
      email,
      password,
    });
    ctxDispatch({type: 'USER_SIGNIN',payload:data})
    localStorage.setItem('userInfo',JSON.stringify(data));
    navigate(redirect || '/')
  } catch (error) {
    alert('invalid email or password')
  }
};
useEffect(()=>{
  if (userInfo) {
    navigate(redirect)
  }
},[navigate,redirect,userInfo])

  return (
    <Container className="small-container">
       <h1 className='my-3'>Signin</h1>
       <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId="email">
        <Form.Label>Email </Form.Label>
        <Form.Control type="email" onChange={(e)=> setEmail(e.target.value)} value={email} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId="password">
        <Form.Label>password</Form.Label>
        <Form.Control type="password" onChange={(e)=> setPassword(e.target.value)} value={password} required  />
        </Form.Group>
        <div className='mb-3'>
            <Button type="submit">Signin</Button>
        </div>
        <div className='mb-3'>
          NEw Customer{''}
          <Link to={`/signup?redirect=${redirect}`}>Create your Account</Link>
        </div>
       </Form>
    </Container>
  )
}

export default Signin;