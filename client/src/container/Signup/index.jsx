import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Style.css'

export const Signup = () => {

    const navigate = useNavigate();
    const [data, setData] = useState({
      username :'',
      email :'',
      password :'',
      confirmpassword:''
    });
  
    const [touched, setTouched] = useState({
      username: false,
      email: false,
      password: false,
      confirmpassword: false
    });

    const [showpass, setshowpass] = useState({
      password : false,
      confirmpassword :false
    })

  
    const handleBlur = (event) => {
      const { name } = event.target;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true
      }));
    };
  
    const validate = () => {
      const errors = {
        username :'',
        email: '',
        password: '',
        confirmpassword: ''
      };

      if(!data.username){
        errors.username = 'username is required'
      }
  
      if (!data.email) {
        errors.email = 'Email is required';
      }
  
      if (!data.password) {
        errors.password = 'Password is required';
      }
  
      if (!data.confirmpassword) {
        errors.confirmpassword = '';
      } else if (data.confirmpassword !== data.password) {
        errors.confirmpassword = 'Passwords do not match';
      }
  
      return errors;
    };
  
    const errors = validate();
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log(data);

      const insertData = await axios.post(`http://localhost:5000/user/createuser`,{
        "username" : data.username,
        "email" : data.email,
        "password" : data.password 
      },{
        headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        }
      })

      
      const res = insertData.request.status;
      if (res == 200) {
        navigate("/login")
      }
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setData({...data,[name]: value});
    };
  
    const handelshowpassword = () => {
      setshowpass({ ...showpass, password: !showpass.password });
    };

    const handelshowconfpassword = () => {
      setshowpass({ ...showpass, confirmpassword: !showpass.confirmpassword });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  return (
    <div className='maincont'>
        <Grid className='formcont'>
            <form  
            className='card'
            onSubmit={handleSubmit}
            style={{display:'flex',flexDirection:'column',gap:'20px'}}
            >

                <Typography className='brand' variant="h2" style={{fontSize:'22px',fontWeight:'900',overflow:'hidden'}}>
                Sign Up for an Account
                </Typography>
                {/* username */}
                <TextField
                    placeholder='Username'
                    variant='outlined'
                    className='input'
                    name="username"
                    value={data.username}
                    onChange={handleChange}

                    onBlur={handleBlur}
                    required
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && !data.username ? 'Required' : null}
                    InputProps={{
                        startAdornment:<MailOutlinedIcon/>
                    }}
                    />
                
                  <TextField
                    placeholder='Email Address'
                    variant='outlined'
                    className='input'
                    name="email"
                    value={data.email}
                    onChange={handleChange}

                    onBlur={handleBlur}
                    required
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
                    required
                    type={showpass.password ? 'text' :"password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && !data.password ? 'Required' : null}
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

                  <TextField
                    placeholder='Confirm Password'
                    variant='outlined'
                    className='input'
                    required
                    type={showpass.confirmpassword ? 'text' : 'password'}
                    name="confirmpassword"
                    value={data.confirmpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    
                    error={touched.confirmpassword && Boolean(errors.confirmpassword)}
                    helperText={touched.confirmpassword && !data.confirmpassword ? 'Required' : errors.confirmpassword}
                    InputProps={{
                      startAdornment:<LockOutlinedIcon/>,
                      endAdornment:<IconButton
                      aria-label="toggle password visibility"
                      onClick={handelshowconfpassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      >
                        {showpass.confirmpassword ? <Visibility/> : <VisibilityOff/> }
                      </IconButton>
                    }}
                  />

                  <Button variant='contained' 
                  // onClick={handleSubmit}
                  className='signupbtn'
                  type='submit'
                  style={{width:'400px', background:'#2563EB', 
                  color:'white', borderRadius:'7px', padding:'13px', fontSize:'17px', fontWeight:'700', textTransform:'inherit'}} 
                  >
                    Sign up
                  </Button>
            </form>
        </Grid>
    </div>
  )
}