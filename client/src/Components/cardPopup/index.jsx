import { Button, Collapse, Dialog, DialogContent, DialogContentText, Grid, Input, InputLabel, Paper, Popover, TextField, Typography, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ReactComponent as Threedot} from './svg/threedot.svg';
import { ReactComponent as Cross} from './svg/Cross.svg';
import { ReactComponent as Description } from './svg/Description.svg'
import { ReactComponent as Message } from './svg/Message.svg'
import { ReactComponent as Arrowdown } from './svg/ArrowDrown.svg'
import { ReactComponent as Arrowup } from './svg/ArrowUp.svg'
import { ReactComponent as Usericon } from './svg/User.svg'
import { makeStyles } from '@mui/styles';
import { ReactComponent as Sendarrow } from './svg/Sendarrow.svg'
import { ReactComponent as Deletesvg } from './svg/delete.svg'
import { ReactComponent as Attachment } from './svg/Attachment.svg'


import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useSelector, useDispatch } from 'react-redux';
import { setaccesstoken, setboarddataredux, setcarddataredux } from '../../redux/actions'
import axios from 'axios';

const useStyles = makeStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: 'transparent', // Ensure the hover state also has no border
        },
        '&.Mui-focused fieldset': {
          borderColor: 'transparent', // Ensure the focused state also has no border
        },
        '& fieldset': {
          border: 'none', // No border,
        },
        '& input':{
          padding:'11px 14px',
          width :'100%'
        }
      },
      borderColor: '#D7DBEC',
      borderRadius: '7px',
      width:'100%',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
  });



  //-------------------------------------------------------------------------------------


const CardDialog = ({Dialogopen, handleClose, selectedcard, currentboard}) => {
    const theme = useTheme();
    const classes = useStyles();
    const userData = useSelector(s=>s);
    const usrdata = userData.auth;
    const dispatch = useDispatch();

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Description & Cmt

    const [attachment, setAttachement] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [cmtcollapse, setcmtCollapse] = useState(false);
    const [description, setDescription] = useState('');
    const [comments, setcomments] = useState('');
    const [datacomment, setDatacomment] = useState();
    const navigate = useNavigate();


    const onSaveHandler = async() =>{
        console.log({description, comments});
        console.log(selectedcard.card_id, usrdata.id);

        const addcmtanddisscussion = await axios.post(`http://localhost:5000/card/creatediscussion`,{
            "cardId" : selectedcard.card_id, 
            "discussion" : description,
          },{
            headers: {
                  "Authorization": localStorage.getItem('accesstoken')
                }
          })
          console.log("changed");
          handleClose()
    }


    useEffect(() => {
        const fetchDiscussion = async () => {
          if (selectedcard.card_id != "") {
            try {
              const response = await axios.get(`http://localhost:5000/card/getdiscussion/${selectedcard.card_id}`, {
                headers: {
                  "Authorization": localStorage.getItem('accesstoken')
                }
              });
              setDescription(response.data[0].discussion);
            } catch (error) {
              console.error('Error fetching discussion:', error);
            }
          }
        };
    
        fetchDiscussion();
    }, [collapse]);


    useEffect(()=>{
        const fetchComment = async () =>{
            if (selectedcard.card_id != "") {
                try {
                    const response = await axios.get(`http://localhost:5000/card/getcmt/${selectedcard.card_id}`,{
                        headers: {
                        "Authorization": localStorage.getItem('accesstoken')
                        }
                    })
                    setDatacomment(response.data)
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchComment();
    },[cmtcollapse])

    const onSavecomment = async() =>{
        try {
            const createcomment = await axios.post(`http://localhost:5000/card/createcmt`,{
                id : selectedcard.card_id,
                comment : comments, 
                userid : usrdata.id
            },{
                headers: {
                  "Authorization": localStorage.getItem('accesstoken')
                }
            })
            const response = await axios.get(`http://localhost:5000/card/getcmt/${selectedcard.card_id}`,{
                headers: {
                "Authorization": localStorage.getItem('accesstoken')
                }
            })
            setDatacomment(response.data)
            console.log("success");
        } catch (error) {
            console.log(error);
        }
    }

    const [deletepopup, setDeletePopup] = React.useState(null);

    const handleClick = (event) => {
        setDeletePopup(event.currentTarget);
    };

    const handleDeleteClose = () => {
        setDeletePopup(null);
    };


    const open = Boolean(deletepopup);
    const id = open ? 'simple-popover' : undefined;
  

    //Delete Handler

    const deletecardHandler = async() =>{
        const deletecard = await axios.delete(`http://localhost:5000/card/deletecard/${selectedcard.card_id}`,{
            headers: {
                "Authorization": localStorage.getItem('accesstoken')
                }
        })

        const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        })
        
        const list = currentboardlists.data[0].list;
        console.log("***************",list);
        dispatch(setcarddataredux(list));
        setDeletePopup(null);
        navigate('/boards')
    }

    // console.log(datacomment[0]);

    //------------------------------------------------------------------------------------------

    const [postImage, setPostImage] = useState({
        myFile: "",
      });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("File ->>>",postImage);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPostImage({ ...postImage, myFile: base64 });
    };

  return (
    <Dialog open={Dialogopen} className='cardpopupdialoug' fullScreen={fullScreen}  PaperProps={{
        style: {
          width: '870px', 
          height:'100%',
          borderRadius:'12px',
          maxWidth: 'none',
        }}} onClose={handleClose} >
            <Grid className='cardpopupnav'>
                <Typography variant='h2'>{selectedcard.card_title}</Typography>
                <Grid className='cardpopupaction'>
                    <Button className='actionbutton' onClick={handleClick}>
                        <Threedot/>
                    </Button>
                    <Popover
                            id={id}
                            open={open}
                            anchorEl={deletepopup}
                            onClose={handleDeleteClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <Grid
                            className='deletepopover'
                            onClick={deletecardHandler}
                            >
                            <Deletesvg/>Delete
                            </Grid>  
                    </Popover>
                    <Button className='actionbutton' variant='contained' style={{backgroundColor:'#EDEDED'}} onClick={handleClose}>
                        <Cross/>
                    </Button>
                </Grid>
            </Grid>
            <Grid className='cardpopupbody'>
                    <Grid className='attachmentCon'>
                        <Attachment/>
                        <Typography className='actionlable' > 
                            Attachment 
                            {attachment ? 
                                <Arrowup onClick={()=>{setAttachement((p)=>!p)}}/>
                                :
                                <Arrowdown onClick={()=>{setAttachement((p)=>!p)}}/>
                            }
                        </Typography>
                    </Grid>
                    <Collapse in={attachment} >
                        <Paper elevation={4} style={{padding:'10px'}}>
                            {/* <TextField
                                multiline
                                value={description}
                                style={{width:'100%'}}
                                onChange={(e)=>{setDescription(e.target.value)}}
                                InputProps={{
                                    disableUnderline: true,
                                }}

                            /> */}
                            <form onSubmit={handleSubmit}>
                                <input
                                type="file"
                                label="Image"
                                name="myFile"
                                accept=".jpeg, .png, .jpg"
                                onChange={(e) => handleFileUpload(e)}
                                />

                                <button>Submit</button>
                            </form>
                        </Paper>
                    </Collapse>
                    <Grid className='descriptionCon'>
                        <Description/>
                        <Typography className='actionlable' > 
                            Description 
                            {collapse ? 
                                <Arrowup onClick={()=>{setCollapse((p)=>!p)}}/>
                                :
                                <Arrowdown onClick={()=>{setCollapse((p)=>!p)}}/>
                            }
                        </Typography>
                    </Grid>
                    <Collapse in={collapse} className={`descriptioncontainer ${collapse ? 'active' : ''}`}>
                        <Paper elevation={4} style={{padding:'10px'}}>
                            <TextField
                                multiline
                                value={description}
                                style={{width:'100%'}}
                                onChange={(e)=>{setDescription(e.target.value)}}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />
                        </Paper>
                    </Collapse>
                    <Grid className='commentcontainer'>
                        <Message/>
                        <Typography className='actionlable'>
                            Comments
                            {cmtcollapse ? 
                                <Arrowup onClick={()=>{setcmtCollapse((p)=>!p)}}/>
                                :
                                <Arrowdown onClick={()=>{setcmtCollapse((p)=>!p)}}/>
                            }
                        </Typography>
                    </Grid>
                    <Collapse in={cmtcollapse} style={{minHeight:'min-content'}}>
                        <Paper elevation={0}>
                            <div>
                            <Grid style={{padding:'5px', display:'flex', flexDirection:'row', gap:'10px'}}>
                                    <Usericon/>
                                    <TextField 
                                        variant='outlined' 
                                        className={classes.root} 
                                        placeholder='Type Comments here.....' 
                                        name='comments'
                                        onChange={(e)=>{setcomments(e.target.value)}}
                                        InputProps={{
                                            endAdornment:<Sendarrow style={{cursor:'pointer'}} onClick={onSavecomment}/>
                                        }}
                                        />
                                </Grid>
                                <Grid>
                                    {datacomment != undefined ? datacomment.map((data, index)=>(
                                        <Grid key={index} className='cmtdesign' >
                                            <Usericon/>
                                            <Typography variant='h6'>{data.comment}</Typography>
                                        </Grid>
                                    )) : <></>}
                                </Grid>
                            </div>
                        </Paper>
                    </Collapse>
                <Grid className='buttoncontainer'>
                    <Button 
                        style={{textTransform:'inherit', background:'linear-gradient(90deg, #5351FC 0%, #19A9FC 100%) !important', overflow:'hidden'}}
                        onClick={onSaveHandler}>
                        Save
                    </Button>
                </Grid>
            </Grid>
    </Dialog>
  )
}

export default CardDialog