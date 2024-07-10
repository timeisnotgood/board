import React, { useState } from 'react'
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { ReactComponent as Cross } from './svg/scross.svg'
import { ReactComponent as Dots } from './svg/dot.svg'
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentboarddataredux, setcarddataredux } from '../../redux/actions'
import Boardcard from '../boardCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './style.css'

const List = ({ currentboard }) => {

    const dispatch = useDispatch();

    let ReduxData = useSelector(data => data);

    const usrid = ReduxData.auth.id;
    let crddata = ReduxData.cardData;
    let currentbrdData = ReduxData.currentboardData[0];

    // Create new List
    
    const [newlistdata, setnewlistdata] = useState('');
    const [newlistpopup, setnewlistpopup] = useState(false);

    const createListHandler = async() =>{
        const newlist = await axios.post(`http://localhost:5000/list/createlist`,{
            listTitle:newlistdata,
            boardId:currentbrdData.id
        },{
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        });

        
    const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentbrdData.id}`,{
        headers:{
            "Authorization":localStorage.getItem('accesstoken')
        }
    })
    const board = currentboardlists.data
    const list = currentboardlists.data[0].list;
    dispatch(setcurrentboarddataredux(board));
    dispatch(setcarddataredux(list));

    setnewlistpopup(!newlistpopup)
    }

    //------------------------------------------------------------------------

    // Delete List
    
    const listdeleteHandler = async(listis)=>{
      const deletedcard = await axios.post(`http://localhost:5000/list/deletelist/${listis}`,{
            brdid : currentbrdData.id
        },
        {
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        })
      

        const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentbrdData.id}`,{
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        })
        const board = currentboardlists.data
        const list = currentboardlists.data[0].list;
        dispatch(setcurrentboarddataredux(board));
        dispatch(setcarddataredux(list));
    }

    //-----------------------------------------------------------------------------

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

    const handleTitleClick = () => {
      setIsEditing(true);
    };
    
    const handleBlur = async() => {
        if (listTitles.listtitle != '') {
            const updateBoardTitle = await axios.put(`http://localhost:5000/list/updatelist`,{
                id : listTitles.listId,
                listTitle : listTitles.listtitle
            },{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            });
    
            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentbrdData.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            const list = currentboardlists.data[0].list;
            dispatch(setcarddataredux(list));   
            setIsEditing(false);
        }
    };

    //-------------------------------------------------------------------------------


    let order = null;

    if (currentbrdData?.list_order != null && (crddata[0]?.list_title != null || crddata.list_id != null)) {
        order = JSON.parse(currentbrdData.list_order);
    }

    return (
        <>
        <Droppable droppableId={currentbrdData?.id != null ? JSON.stringify(currentbrdData.id) : '0'} direction='horizontal' type='list'>
        {(provided) =>(
            <div 
                className='boardinner'
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {currentbrdData?.list_order && crddata[0]?.list_title != null && crddata[0]?.list_id != null  ? order.map((id, index)=>{
                    let [data] = crddata.filter( data => data.list_id == id)
                    return(
                        <Draggable
                        draggableId={JSON.stringify(data?.list_id)}
                        key={JSON.stringify(data?.list_id)}
                        index={index}>
                            {(provided)=>(
                                <div
                                    className='boardcard' 
                                    key={data?.list_id}
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <div className='cardnav' >
                                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                            <Typography
                                                onInput={(e) => handleTitleChange(data?.list_id, e.target.innerText)}
                                                onClick={handleTitleClick}
                                                onBlur={()=>handleBlur(data?.list_id)}
                                                contenteditable="true"
                                                variant='h6'>
                                                {data?.list_title}
                                            </Typography>
                                                <span style={{fontSize:'14px'}}>({data?.card_order ? JSON.parse(data.card_order).length : 0})</span>
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
                                                                <p onClick={()=>{listdeleteHandler(data.list_id)}}>Delete List</p>
                                                            </div>
                                                            </Popover>
                                                        </div>
                                                    )}
                                                </PopupState>
                                            </Grid>
                                        }
                                    </div> 
                                        <Boardcard currentboard={currentboard} listId={JSON.stringify(data?.list_id)}/>
                                </div> 
                            )}
                        </Draggable>
                    )
                }) : <></>}                    
            {provided.placeholder}
            </div>
        )}
        </Droppable>
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
        </>

      )
    }

export default List