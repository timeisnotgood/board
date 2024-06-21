import { Button, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { ReactComponent as Dasicon } from './img/layout-grid.svg';
import { ReactComponent as Foldericon } from './img/folder-plus.svg';
import SettingsIcon from '@material-ui/icons/Settings';
import {useNavigate, useLocation} from 'react-router-dom'
import logo from './img/logo.png'
import './style.css'

const Nav = ({isDropdown, dropdownhandler}) => {

  // for Routing buttons 

  const [activebutton, setactivebutton] = useState('')
  const location = useLocation();

  console.log("location", location.pathname);

  const activebuttonHandler = (e) =>{
    setactivebutton(e);
  }
  console.log(activebutton);

  //------------------------------

  // for setting button
  // console.log(isDropdown);
  //------------------------------
  return (
    <Grid container className='navbar'>
        <Grid xs={2} item style={{overflow:'hidden'}}>
            <img  src={logo} alt="Logo" width='35px' height='35px'/>
        </Grid>
        <Grid xs={8} item
          style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:'5px'}}>


          <Button 
          className={`dasbutton ${activebutton == 'dashboard' || location.pathname == '/' ? 'active' : ''}`}
          onClick={()=>activebuttonHandler('dashboard')}
          variant={`${activebutton == 'dashboard' ? 'outlined' : 'text'}`}>
            <span  className='logospan'>
              <Dasicon />
              <span className='logotext'>
                Dashboard
              </span>
            </span>
          </Button>

          <Button 
          className={`dasbutton ${activebutton == 'board' ? 'active' : ''}`}
          onClick={(e)=>activebuttonHandler('board')}
          variant={`${activebutton == 'board' ? 'outlined' : 'text'}`}>
            <span className='logospan'>
              <Foldericon/>
              <span className='logotext'>
                Boards
              </span>
            </span>
          </Button>

        </Grid>
        <Grid xs={2} item className='setting'>
        <span onClick={()=>dropdownhandler(!isDropdown)}>
          <SettingsIcon/>
        </span>
        </Grid>
    </Grid>
  )
}

export default Nav