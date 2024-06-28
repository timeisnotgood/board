import { Button, Dialog, DialogContent, DialogContentText, Grid, Typography, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ReactComponent as Threedot} from './svg/threedot.svg';
import { ReactComponent as Cross} from './svg/Cross.svg';
import { ReactComponent as Description } from './svg/Description.svg'
import { ReactComponent as Message } from './svg/Message.svg'
import { ReactComponent as Arrowdown } from './svg/ArrowDrown.svg'

import React from 'react'
import './style.css'

const CardDialog = ({Dialogopen, handleClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Dialog open={Dialogopen} className='cardpopupdialoug' fullScreen={fullScreen} fullWidth maxWidth="md" onClose={handleClose} >
            <Grid className='cardpopupnav'>
                <Typography variant='h2'>Card Name</Typography>
                <Grid className='cardpopupaction'>
                    <Button className='actionbutton'>
                        <Threedot/>
                    </Button>
                    <Button className='actionbutton' variant='contained' style={{backgroundColor:'#EDEDED'}}>
                        <Cross/>
                    </Button>
                </Grid>
            </Grid>
            <Grid className='cardpopupbody'>
                <Grid className='cardactivities' style={{marginTop:'20px'}}>
                    <Description/>
                    <Typography> Description <Arrowdown/></Typography>
                </Grid>
                <Grid className='cardactivities'>
                    <Message/>
                    <Typography>Comments <Arrowdown/></Typography>
                </Grid>
                <Grid style={{display:'flex', flexDirection:'row',justifyContent:'end'}}>
                    <Button style={{textTransform:'inherit', background:'linear-gradient(90deg, #5351FC 0%, #19A9FC 100%) !important'}}>Save</Button>
                </Grid>
            </Grid>
    </Dialog>
  )
}

export default CardDialog