import React from 'react'
// import { Button, Grid, Stack, Typography } from '@mui/material'
// import AddIcon from '@mui/icons-material/Add';
import './board.css'
// import DropDownMenu from 'material-ui/DropDownMenu';
// import Select from '@material-ui/core/Select';

// -<DropDownMenu></DropDownMenu>
// +<Select value={this.state.value}></Select>


const Board = () => {
  return (
    <section className='board'>
        <nav className='boardnav'>
            {/* <Grid container spacing={1}>
                <Grid item xs={6} className='boardname'>
                    <Typography variant='h5'>flow one Copy</Typography>
                </Grid>
                <Grid item xs={6} className='boardactions'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="20px" viewBox="0 0 12 12" fill="none" className="s"><path d="M10.5 2.98999C8.835 2.82499 7.16 2.73999 5.49 2.73999C4.5 2.73999 3.51 2.78999 2.52 2.88999L1.5 2.98999" stroke="#2563EB" class="fillStroke" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485" stroke="#2563EB" class="fillStroke" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.42501 4.57007L9.10001 9.60507C9.04501 10.3901 9.00001 11.0001 7.60501 11.0001H4.39501C3.00001 11.0001 2.95501 10.3901 2.90001 9.60507L2.57501 4.57007" stroke="#2563EB" class="fillStroke" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.16498 8.25H6.82998" stroke="#2563EB" class="fillStroke" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.75 6.25H7.25" stroke="#2563EB" class="fillStroke" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <select className='boarddd'>
                        
                        <option>one</option>
                        <option>one</option>
                    </select>
                    <Button variant='contained' size='small' style={{width:'fit-content'}}>
                        <AddIcon/>
                    </Button>
                </Grid>
            </Grid> */}
        </nav>
    </section>
  )
}

export default Board