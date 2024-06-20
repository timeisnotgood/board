import { Button, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { ReactComponent as Dasicon } from './img/layout-grid.svg';
import { ReactComponent as Foldericon } from './img/folder-plus.svg';
import logo from './img/logo.png'
import './style.css'

const Nav = () => {

  const [activebutton, setactivebutton] = useState('')

  const activebuttonHandler = (e) =>{
    setactivebutton(e);
  }
  console.log(activebutton);

  return (
    <Grid item 
    className='navbar'>
        <Grid xs={2} style={{overflow:'hidden'}}>
            <img  src={logo} alt="Logo" width='35px' height='35px'/>
        </Grid>
        <Grid xs={8}
          style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:'5px'}}>


          <Button 
          className={`dasbutton ${activebutton == 'dashboard' ? 'active' : ''}`}
          onClick={()=>activebuttonHandler('dashboard')}
          variant={`${activebutton == 'dashboard' ? 'outlined' : 'none'}`}>
            <span  className='logospan'>
              <Dasicon />
              Dashboard
            </span>
          </Button>

          <Button 
          className={`dasbutton ${activebutton == 'board' ? 'active' : ''}`}
          onClick={(e)=>activebuttonHandler('board')}
          variant={`${activebutton == 'board' ? 'outlined' : 'none'}`}>
            <span className='logospan'>
              <Foldericon/>
              Boards
            </span>
          </Button>

        </Grid>
        <Grid xs={2}>three</Grid>
    </Grid>
  )
}

export default Nav