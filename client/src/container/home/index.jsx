import React from 'react'
import { useSelector} from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Nav from '../../Components/navbar/Nav';
import './style.css'
// import flozylogo from './logo.png'

const Dashboard = () => {

  const tokenState = useSelector((s)=>s)
  console.log(tokenState.auth);
  return (
    <div className='maincontainer'>
      <Grid 
        container
        className='subcontainer'
        direction="column">
      <Nav/>
      {/* body */}
      </Grid>
    </div>
  )
}

export default Dashboard