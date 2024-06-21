import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Nav from '../../Components/navbar/Nav';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {useNavigate} from 'react-router-dom'
import './style.css'
import { Button } from '@material-ui/core';
// import flozylogo from './logo.png'

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    console.log("home route*************");
    const token = localStorage.getItem('accesstoken');
    console.log("tokenn*************",token);
    if (token == null) {
      console.log("token invalid push to login",token);
      navigate('/login');
    }
  },[])

  // Drop Down -----------------
  const [isDropdown, setisDropdown] = useState(false)

  const dropdownhandler = (data) =>{
    setisDropdown(data)
  }

  console.log(isDropdown);

  //------------------------

  // user data --------------------
  const userdata = useSelector(s => s)
  console.log("****************", userdata);

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

  // Logout Handler
  const logoutHandler = () =>{
    localStorage.removeItem('accesstoken');
    navigate('/login');
  }

  return (
    <div className='maincontainer'>
      <Grid 
        container
        className='subcontainer'
        direction="column">
        <Nav isDropdown={isDropdown} dropdownhandler={dropdownhandler} />
        {isDropdown &&
          <div className='dropdown' >
            <div className='innerdropdown'>
              <div className='usericon'>
                {/* <AccountCircleIcon style={{ fontSize: 35 }} /> */}
                <svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z" fill="#4A5699" /><path d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z" fill="#C45FA0" /><path d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z" fill="#E5594F" /></svg>
              </div>
              <div className='userdata'>
                <p>{userdata.auth.username}</p>
                <p>{userdata.auth.email}</p>
              </div>
            </div>
            <Button 
              style={{textTransform:'inherit', fontWeight:'600', fontSize:'15px'}}
              onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        }
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
                            <Grid item xs={6}>
                              {s.brd_title}
                            </Grid>
                            <Grid item xs={6}>
                              {dateConverter(s.created_at)}
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
                  <h4>Comming Soon...</h4>
                </div>
              </Grid>
            </Grid>
          </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard