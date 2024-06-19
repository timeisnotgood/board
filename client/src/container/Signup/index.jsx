import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { Button, FilledInput, FormControl, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import MailOutlinedIcon from '@material-ui/icons/MailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import './Style.css'

export const Signup = () => {
    // const classes = useStyles();

    const [data, setData] = useState({
      email :'',
      passowrd :'',
      confirmpassword:''
    });
  
    const [touched, setTouched] = useState({
      email: false,
      password: false,
      confirmPassword: false
    });

    const [showpass, setshowpass] = useState({
      password : false,
      confirmpassword :false
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
        confirmPassword: ''
      };
  
      if (!data.email) {
        errors.email = 'Email is required';
      }
  
      if (!data.password) {
        errors.password = 'Password is required';
      }
  
      if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
      } else if (data.confirmPassword !== data.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
  
      return errors;
    };
  
    const errors = validate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (!errors.email && !errors.password && !errors.confirmPassword) {
        // Handle form submission logic here
        console.log(data);
      }
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
            <form onSubmit={handleSubmit} className='card'>

                <Typography className='brand' color='black' variant="h2" style={{fontSize:'22px',fontWeight:'900',overflow:'hidden'}}>
                Sign Up for an Account
                </Typography>

                <Grid 
                 className='cardactins'
                 style={{display:'flex',flexDirection:'column',gap:'20px'}}
                 xs={12}
                 >

                  <TextField
                    placeholder='Email Address'
                    variant='outlined'
                    className='input'
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email ? 'Required' : null}
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
                    helperText={touched.password ? 'Required' : null}
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
                    type={showpass.confirmpassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword ? 'Required' : null}
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
                  style={{width:'400px', background:'#2563EB', 
                  fontcolor:'white', borderRadius:'7px', padding:'15px', fontSize:'17px', fontWeight:'700', textTransform:'lowercase'}} 
                  href="#outlined-buttons">
                    Sign up
                  </Button>
                </Grid>

            </form>
        </Grid>
    </div>
  )
}






// <Grid className='formcont'> 
//             <FormControl className='card' >
//                     <Typography sx={{ fontSize: '23px', fontWeight: '700' }}
//                     color='black'
//                     variant="h1" component="h2">Sign Up for an Account</Typography>
//                     <TextField
//                         variant='outlined'
//                         className='input' 
//                         placeholder='Email Address'
//                         InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                             <EmailOutlinedIcon />
//                             </InputAdornment>
//                         ),
//                         }}
//                     />
//                     <TextField 
//                     className='input'
//                     type='password'
//                     placeholder='Password'
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                             <LockOutlinedIcon />
//                             $$$$
//                             </InputAdornment>
//                         ),
//                         }}
//                     />
//                     <TextField 
//                     className='input'
//                     type='password'
//                     placeholder='Confirm Password'
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                             <LockOutlinedIcon />
//                             </InputAdornment>
//                         ),
//                         }}
//                     />
//             </FormControl>
//         </Grid>
//         <TextField
//             placeholder='Email Address'
//             InputProps={{
//                 startAdornment: <InputAdornment position="start">test</InputAdornment>
//             }}
//         />