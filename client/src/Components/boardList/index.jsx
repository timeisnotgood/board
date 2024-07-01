import React, { useState } from 'react'
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { ReactComponent as Cross } from './svg/scross.svg'
import { ReactComponent as Dots } from './svg/dot.svg'
import { Button, Grid, InputBase, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setcarddataredux } from '../../redux/actions'
import Boardcard from '../boardCard';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles({
    inputField: {
      padding: '0px',
      margin: '0px',
      height: '30px', // Adjust the height as needed
      '& input': {
        padding: '0px',
        fontSize: '22px', // Match the h1 font size
        fontWeight: 700, // Match the h1 font weight
        width:'160px'        
      },
    },
    input: {
        fontSize: '22px',
        fontWeight: 700,
        padding: '0px',
        border: '2px solid black',
        borderRadius: '12px',
        width: props => `${props.listtitle.length + 1}ch`, // +1 to ensure there's space for a new character
        transition: 'width 0.2s ease-out',
    },
    hiddenInput: {
        border: 'none',
        padding: '0px',
        fontSize: '22px',
        fontWeight: 700,
    },
    typography: {
      fontSize: '22px',
      fontWeight: 700,
    },
  });

const List = ({crddata, currentboard, setcurrentboard}) => {

      const dispatch = useDispatch();
    //   const classes = useStyles({ listtitle });


      // Create new List

      const [newlistdata, setnewlistdata] = useState('');
      const [newlistpopup, setnewlistpopup] = useState(false);
      const createListHandler = async() =>{
          console.log(newlistdata, currentboard.id);
          const newlist = await axios.post(`http://localhost:5000/list/createlist`,{
              listTitle:newlistdata,
              boardId:currentboard.id
          },{
              headers:{
                  "Authorization":localStorage.getItem('accesstoken')
              }
          });
  
          const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
              headers:{
                  "Authorization":localStorage.getItem('accesstoken')
              }
          })
          const list = currentboardlists.data[0].list;
          console.log(list);
          dispatch(setcarddataredux(list));
          setnewlistpopup(!newlistpopup)
          console.log(newlistdata);
      }

    // Delete List
    
    const listdeleteHandler = async(listis)=>{
      const deletedcard = await axios.delete(`http://localhost:5000/list/deletelist/${listis}`,{
            brdid : currentboard.id
        },{
          headers:{
              "Authorization":localStorage.getItem('accesstoken')
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
      // console.log(deletedcard);
  }

    //update Board Title

    const [isEditing, setIsEditing] = useState(false);
    const [listTitles, setListTitles] = useState({
        listId:'',
        listtitle : ''
    });

    const handleTitleChange = (listId, newTitle) => {
        setListTitles({
            listId:listId,
            listtitle : newTitle
        })
    };

    const userData = useSelector(s=>s);

    const handleTitleClick = () => {
      setIsEditing(true);
    };

    
    const handleBlur = async() => {
        const id = userData.auth.id;
        if (listTitles.listtitle != '') {
            const updateBoardTitle = await axios.put(`http://localhost:5000/list/updatelist`,{
                id : listTitles.listId,
                listTitle : listTitles.listtitle
            },{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            });
    
            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            const list = currentboardlists.data[0].list;
            dispatch(setcarddataredux(list));   
            setIsEditing(false);
        }
    };

  return (
    <div className='boardinner'>
                {crddata[0]?.list_title != null && crddata.length > 0 ? crddata.map((data)=>(
                            <div className='boardcard' key={data.list_id} >
                                <div className='cardnav'>
                                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                            <Typography 
                                                onInput={(e) => handleTitleChange(data.list_id, e.target.innerText)}
                                                onClick={handleTitleClick}
                                                onBlur={()=>handleBlur(data.list_id)}
                                                contenteditable="true"
                                                variant='h6'>
                                                {data.list_title}
                                            </Typography>
                                                <span style={{fontSize:'14px'}}>({data.cards ? data.cards.length : 0})</span>
                                        </div>
                                        {
                                            <Grid>
                                                <PopupState variant="popover" popupId="demo-popup-popover" >
                                                    {(popupState) => (
                                                        <div >
                                                            <span onClick={()=>{setcardactionpopup(!cardactionpopup)}}  {...bindTrigger(popupState)}>
                                                                <Dots/>
                                                            </span>
                                                            <Popover
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                                }}
                                                                transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                                }}
                                                                className='cardnavactions'
                                                                style={{padding:'8px 0px'}}
                                                            >
                                                            <div className='cardnavactions'>
                                                                <p onClick={()=>{console.log(data.list_id)}}>Add Card</p>
                                                                <p onClick={()=>{listdeleteHandler(data.list_id)}}>Delete List</p>
                                                            </div>
                                                            </Popover>
                                                        </div>
                                                    )}
                                                </PopupState>
                                            </Grid>
                                        }
                                </div>
                                <Boardcard data={data} currentboard={currentboard}/>
                            </div>
                )) : <></>}
                <div className='listaction'>
                    <Grid className='listbutton' onClick={()=>setnewlistpopup(!newlistpopup)}>
                        <span>{crddata[0]?.list_title != null && crddata.length > 1 ? '+ Add another list' : '+ Add list'}</span>
                    </Grid>
                    { newlistpopup &&   
                        <Grid className='listinputpopup'>
                            <TextField onChange={(e)=>{setnewlistdata(e.target.value)}}/>
                            <Grid className='listinputpopupaction'>
                                <Button onClick={createListHandler}>Add List</Button>
                                <Cross onClick={()=>setnewlistpopup(!newlistpopup)}/>
                            </Grid>
                        </Grid>
                    }
                </div>
            </div>
  )
}

export default List