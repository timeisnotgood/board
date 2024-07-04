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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'


const List = ({ currentboard }) => {

      const dispatch = useDispatch();
      let listdata = useSelector(data => data);
      let crddata = listdata.cardData;

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
        console.log("working",currentboard.id);
      const deletedcard = await axios.post(`http://localhost:5000/list/deletelist/${listis}`,{
            brdid : currentboard.id
        },
        {
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
    
    // console.log(crddata);

  return (
    <div className='boardinner'>
                {crddata[0]?.list_title != null && crddata.length > 0 ? crddata.map((data, index)=>(
                    <Droppable droppableId={JSON.stringify(data.list_id)}>
                        {(provided)=>(
                        <div className='boardcard' key={JSON.stringify(data.list_id)} {...provided.droppableProps} ref={provided.innerRef}>
                            <div className='cardnav' >
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
                            <Boardcard currentboard={currentboard} listId={JSON.stringify(data.list_id)}/>
                            {provided.placeholder}
                        </div> 
                        )}
                    </Droppable>
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