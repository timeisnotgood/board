import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { Button, FilledInput, FormControl, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './style.css'

export const Login = () => {

  const [data, setData] = useState({
    email :'',
    password :'',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showpass, setshowpass] = useState({
    password : false,
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
  };

  const validate = () => {
    const errors = {
      email: '',
      password: '',
    };

    if (!data.email) {
      errors.email = 'Email is required';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const errors = validate();

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(data);

    const logindata = await axios.post(`http://localhost:5000/user/login`,{
      'email' : data.email,
      'password' : data.password
    },{
       headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        }
    })

    console.log(logindata); 
  };

  const handelshowpassword = () => {
    setshowpass({ ...showpass, password: !showpass.password });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
<div className='maincont'>
        <Grid className='formcont'>
            <form onSubmit={handleSubmit} className='card'>

                <Typography 
                className='brand'
                variant="h2"
                style={{fontSize:'22px',fontWeight:'900',overflow:'hidden'}}>
                Login for an Account
                </Typography>

                <Grid 
                 className='cardactins'
                 style={{display:'flex',flexDirection:'column',gap:'20px'}}
                 xs={12}>

                  <TextField
                    placeholder='Email Address'
                    variant='outlined'
                    className='input'
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && !data.email ? 'Required' : null}
                    InputProps={{
                        startAdornment:<MailOutlinedIcon/>
                    }}
                    />

                  <TextField
                    placeholder='Password'
                    variant='outlined'
                    className='input'
                    type={showpass.password ? 'text' :"password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && !data.password? 'Required' : null}
                    InputProps={{
                      startAdornment:<LockOutlinedIcon/>,
                      endAdornment: <IconButton
                        aria-label="toggle password visibility"
                        onClick={handelshowpassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showpass.password ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    }}
                  />

                  <Button variant='contained' type='submit'
                  style={{width:'400px', background:'#2563EB', 
                  color:'white', borderRadius:'7px', padding:'13px', fontSize:'17px', fontWeight:'700', textTransform:'lowercase'}} >
                    Login
                  </Button>
                </Grid>

            </form>
        </Grid>
    </div>
  )
}