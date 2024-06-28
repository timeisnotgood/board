// PrivateRoutes.js
import React, { useEffect, useState } from 'react';
import { redirect, Outlet, useNavigate } from 'react-router-dom';
import Nav from '../Components/navbar/Nav'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setaccesstoken, setboarddata } from '../redux/actions'


const PrivateRoutes = () => {

  // const token
  const dispatch = useDispatch();

  const [userdata, setuserdata] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    const isAuthenticated = () => {
      const token = localStorage.getItem('accesstoken');

      if (token == null) {
        navigate('/login')
      }else{
        const userdata = jwtDecode(token);
        setuserdata(userdata.user);
        dispatch(setaccesstoken(userdata.user))
      }
    };
    isAuthenticated();
  },[])

  useEffect(() => {
    if (userdata === null) {
      navigate('/login');
    }
  }, [userdata, navigate]);

   return ( 
    userdata != null ? (
    <>
      <Nav user={userdata} />
      <Outlet/>
    </>
   ) : null
  )
};

export default PrivateRoutes;
