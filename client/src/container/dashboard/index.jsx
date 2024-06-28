import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Nav from '../../Components/navbar/Nav';
import {useNavigate} from 'react-router-dom'
import './style.css'
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles({
  inputField: {
    padding: '0px',
    margin: '0px',
    width: 'max-content',
  },
});

const Dashboard = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  useEffect(()=>{
    // console.log("home route*************");
    const token = localStorage.getItem('accesstoken');
    // console.log("tokenn*************",token);
    if (token == null) {
      console.log("token invalid push to login",token);
      navigate('/login');
    }
  },[])

  // user data --------------------
  const userdata = useSelector(s => s)
  // console.log("****************", userdata);

  //-------------------------------

  // Date Formate converter
  const dateConverter = (data) =>{
    const date = new Date(data);

    // Get date in YYYY-MM-DD format
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  //---------------------------------------


  return (
    <div className='maincontainer'>
      <Grid 
        container
        className='subcontainer'
        direction="column">
          <Grid container className='body' >
            <Grid item xs={12} sm={6} className='bodycontainer'>
              <Grid className='containertext'>
                <div className='firstcontainer'>
                  <h1>Hi {userdata.auth.username} 👋🏻👋🏻</h1>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className='bodycontainer'>
              <Grid className='containertext'>
                <div className='secondcontainer'>
                  <h4>A daily reminder to your future self:</h4>
                  <p> hello siri ..!!</p>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className='bodycontainer'>
              <Grid className='containertext'>
                <div className='thirdcontainer'>
                  <h4>Recent Boards</h4>
                  <div className='innerthirdcontainer' style={{width:'100%'}}>
                    <div style={{width:'100%'}}>
                      { userdata.boarddata?.length > 0 &&
                        userdata.boarddata.map((s)=>(
                          <Grid container style={{width:'100%'}}>
                            <Grid item xs={6} style={{color:'rgba(128, 128, 128, 0.733)', fontWeight:'600'}}>
                              {s.brd_title}
                            </Grid>
                            <Grid item xs={6} style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                              <div style={{color:'rgba(128, 128, 128, 0.733)', fontWeight:'500'}}>
                                {dateConverter(s.created_at)}
                              </div>
                            </Grid>
                          </Grid>
                      ))
                      }
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className='bodycontainer'>
              <Grid className='containertext'>
                <div className='fourthcontainer'>
                {/* <TextField
                    value={"kjhkj"}
                    variant='outlined'
                    margin='normal'
                    style={{padding:'0px',margin:'0px', width:'max-content'}}
                    autoFocus
                    className={classes.inputField}
                    /> */}
                    Comming Soon....
                </div>
              </Grid>
            </Grid>
          </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard