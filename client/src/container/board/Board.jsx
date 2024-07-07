import React, { useEffect, useState } from 'react'
import './style.css'
import { Button, Dialog, DialogActions, DialogContentText, Grid, InputAdornment, InputBase, MenuItem, Popper, Select, TextField, Typography } from '@material-ui/core'
import { ReactComponent as Deletesvg } from './svg/delete.svg'
import { ReactComponent as Addsvg } from './svg/add.svg'
import { ReactComponent as Dots } from './svg/dot.svg'
import { ReactComponent as Arrow } from './svg/inputarrow.svg'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setboarddataredux, setcarddataredux } from '../../redux/actions'
import { ReactComponent as Cross } from './svg/scross.svg'
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import List from '../../Components/boardList';
import { DragDropContext } from 'react-beautiful-dnd'


const Board = () => {

    const [boardpopup, setboardpopup] = useState(null);
    const [addpopup, setaddpopup] = useState(false);
    const [deletepopup, setdeletepopup] = useState(false);
    const userData = useSelector(s=>s);
    const dispatch = useDispatch();
    const brddata = userData.boarddata;
    const usrdata = userData.auth;
    const crddata = userData.cardData;

    const [boarddata, setboarddata] = useState();
    
    const [currentboard, setcurrentboard] = useState({
        brd_title:'',
        id:''
    })

    const open = Boolean(boardpopup);
    const id = open ? 'transitions-popper' : undefined;


    // get All board

    useEffect(async()=>{
        const id = usrdata.id;
        const boards = await axios.get(`http://localhost:5000/board/getboard/${id}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );
        setboarddata(boards.data)
        dispatch(setboarddataredux(boards.data))
        if (boards.data[boards.data.length-1]?.brd_title != null) {
            setcurrentboard({
                brd_title: boards.data[boards.data.length-1].brd_title,
                id : boards.data[boards.data.length-1].id
            })
            setBoardTitle(boards.data[boards.data.length-1].brd_title);
        }
        if(currentboard.brd_title != '' && currentboard.id != ''){
            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            const list = currentboardlists.data[0].list;
             dispatch(setcarddataredux(list));
        }   
    },[])

    // get Single board

    useEffect(async()=>{
        if(currentboard.brd_title != '' && currentboard.id != ''){
            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            const list = currentboardlists.data[0].list;
             dispatch(setcarddataredux(list));
        }   
    },[currentboard])


    // Delete boards handler

    const deleteBoardHandler = async() =>{
        const id = usrdata.id;

        console.log(currentboard);
        try {
            const deleteBoard = await axios.delete(`http://localhost:5000/board/deleteboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            });
            const boards = await axios.get(`http://localhost:5000/board/getboard/${id}`,
                {
                    headers:{
                        "Authorization":localStorage.getItem('accesstoken')
                    }
                }
            );
            setboarddata(boards.data);
            dispatch(setboarddataredux(boards.data))
            console.log("****************",boards.data[0].brd_title);
            setcurrentboard({brd_title:boards.data[boards.data.length-1].brd_title, id:boards.data[boards.data.length-1].id})
            setdeletepopup(!deletepopup)
            console.log("deleted successfully");
        } catch (error) {
            console.log(error);
        }
    }

    // ----------------------------

    // Create boards Handler

    const [createboardinput, setcreateboardinput] = useState({boardtitle:''})
    const createBoardhandler = async() =>{
        const id = userData.auth.id;
        const createdBoard = await axios.post(`http://localhost:5000/board/createboard`,{
            boardTitle:createboardinput.boardtitle,
            userId:id
        },{
            headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
        })

        setaddpopup(!addpopup);

        const boards = await axios.get(`http://localhost:5000/board/getboard/${id}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );
        setboarddata(boards.data)
        dispatch(setboarddataredux(boards.data))        
        setcurrentboard({
            brd_title: createboardinput.boardtitle,
            id : createdBoard.data.boardid
        })
    }

    //update Board Title

    const [isEditing, setIsEditing] = useState(false);
    const [boardtitle, setBoardTitle] = useState(currentboard.brd_title);
  
    const handleTitleClick = () => {
      setIsEditing(true);
    };
  
    const handleBlur = async() => {
        const id = userData.auth.id;

        const updateBoardTitle = await axios.put(`http://localhost:5000/board/updateboard`,{
            id : currentboard.id,
            boardTitle : boardtitle
        },{
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        });

        const boards = await axios.get(`http://localhost:5000/board/getboard/${id}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );
        setboarddata(boards.data)
        dispatch(setboarddataredux(boards.data))   
        console.log("current",boards.data);     
        setcurrentboard({
            brd_title: boardtitle,
            id : currentboard.id
        })
      setIsEditing(false);
    };

    // Drag and drop

    const onCarddragEnd = async(result) =>{
        console.log("Result -->",result);
        const {draggableId, source, destination, type} = result;

        if(!destination) return;
        if (destination.draggableId === source.droppableId 
            && destination.index === source.index) return;

        const start = source.droppableId;
        const finish = destination.droppableId;
        const [currentList] = crddata.filter( el => el.list_id == source.droppableId);
        const [destinationList] = crddata.filter( el => el.list_id == destination.droppableId);

        if (type == "list") {

            let listOrder = JSON.parse(brddata[0].list_order);
            console.log(listOrder);
            listOrder.splice(source.index, 1);
            listOrder.splice(destination.index, 0, JSON.parse(draggableId));
            console.log("listOrder", listOrder);
        }else{
            if (start == finish) {
                let cardOrder = JSON.parse(currentList.card_order);
                cardOrder.splice(source.index, 1);
                cardOrder.splice(destination.index, 0, JSON.parse(draggableId));    
                const sortedlist = {
                    ...currentList,
                    card_order : JSON.stringify(cardOrder),
                } 
        
                const updatedlistdata = crddata.filter( el => el.list_id != source.droppableId);
                updatedlistdata.unshift(sortedlist);
                dispatch(setcarddataredux(updatedlistdata));    
        
                // saving card order
        
                const updatecardorder = await axios.post(`http://localhost:5000/list/updatecardorder`,{
                id :source.droppableId, 
                cardOrder: JSON.stringify(cardOrder)
                },{
                    headers:{
                        "Authorization":localStorage.getItem('accesstoken')
                    }
                })  
                return; 
            }
    
            const startList = JSON.parse(currentList.card_order);
            const endList = JSON.parse(destinationList.card_order)
    
            if (endList === null || endList == '') {
    
                // existing to null card list
    
                startList.splice(source.index, 1);//[56,57]
                const currentlists = {
                    ...currentList,
                    card_order : JSON.stringify(startList),
                    cards : currentList.cards.filter( el => el.card_id != draggableId)
    
                }
    
                // adding card to null card List
    
                let newlistarray = [JSON.parse(draggableId)];
                const stringifyedarray = JSON.stringify(newlistarray)//[55]            
    
                const destinationlists = {
                    ...destinationList,
                    card_order:stringifyedarray,
                    cards : currentList.cards.filter( el => el.card_id == draggableId)
                }
    
                const updatedlistdata = crddata.filter( el => el.list_id != source.droppableId && el.list_id != destination.droppableId);
    
                updatedlistdata.unshift(destinationlists);
                updatedlistdata.unshift(currentlists);
                console.log("updatedList", updatedlistdata);
                const list = JSON.parse(brddata[0].list_order);
                let newarrr = [];
                list.map( id =>{
                    let [order] = updatedlistdata.filter( el => el.list_id == id);
                    newarrr.push(order);
                })
                console.log("newArr", newarrr);
    
                dispatch(setcarddataredux(newarrr));
    
                // Updating Source cardOrder
    
                const updatecardorder = await axios.post(`http://localhost:5000/list/updatecardorder`,{
                    id :source.droppableId, 
                    cardOrder: JSON.stringify(startList)
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    })  
    
                // Updating Destination cardOrder
    
                const othercardorder = await axios.post(`http://localhost:5000/list/updatecardorder`,{
                    id :destination.droppableId, 
                    cardOrder: stringifyedarray
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    })
    
                // updating listId
    
                const updatecardId = await axios.post(`http://localhost:5000/card/cardinterchange`,{
                    id :draggableId, 
                    listId: destination.droppableId
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    })
            
                    return;
                
            }else{
    
                //existing to existing
    
                let currentcardOrder = JSON.parse(currentList.card_order);
                currentcardOrder.splice(source.index, 1);//[56,57]
    
                const currentlists = {
                    ...currentList,
                    card_order : JSON.stringify(currentcardOrder),
    
                }
                console.log("startList", currentlists);
     
    
                let destinationcardorder = JSON.parse(destinationList.card_order);
                destinationcardorder.splice(destination.index, 0, JSON.parse(draggableId));
    
                const [removedcard] = currentList.cards;
                destinationList.cards.push(removedcard)
                console.log("removedcard",removedcard);
    
                const destinationlists = {
                    ...destinationList,
                    card_order:JSON.stringify(destinationcardorder),
                }
    
                console.log("destinationList", destinationList);
    
                const updatedlistdata = crddata.filter( el => el.list_id != source.droppableId && el.list_id != destination.droppableId);
                
    
                updatedlistdata.unshift(currentlists);
                updatedlistdata.unshift(destinationlists);
                
                console.log("updatedList", updatedlistdata);
    
                const list = JSON.parse(brddata[0].list_order);
                let newarrr = [];
                list.map( id =>{
                    let [order] = updatedlistdata.filter( el => el.list_id == id);
                    newarrr.push(order);
                })
                console.log("newArr", newarrr);
    
                dispatch(setcarddataredux(newarrr));
    
                const currentupdatecardorder = await axios.post(`http://localhost:5000/list/updatecardorder`,{
                    id :source.droppableId, 
                    cardOrder: JSON.stringify(currentcardOrder)
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    }) 
    
                const destinationupdatecardorder = await axios.post(`http://localhost:5000/list/updatecardorder`,{
                    id :destination.droppableId, 
                    cardOrder: JSON.stringify(destinationcardorder)
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    })
    
                const updatecardId = await axios.post(`http://localhost:5000/card/cardinterchange`,{
                    id :draggableId, 
                    listId: destination.droppableId
                    },{
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    })
    
                    return; 
            }
    
        }
    }

    //-------------------------------------------------------------

  return (
    <section className='board'>
        <Grid container className='boardnav' >
            <Grid item xs={12} sm={6} style={{padding:'2px'}}>
                <div className='boardactions'>
                    <span onClick={()=>{setdeletepopup(!deletepopup)}} style={{cursor:'pointer'}}>
                        <Deletesvg/>
                        <Dialog open={deletepopup} onClose={()=>setdeletepopup(false)} className='deletepop' PaperProps={{style: {padding: '16px'}}}>
                            <DialogContentText>Are you sure you want to delete this Board?</DialogContentText>
                            <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                                <Button variant='outlined' onClick={()=>{setdeletepopup(!deletepopup)}}>Cancel</Button>
                                <Button color='primary' variant='contained' style={{backgroundColor:'#2563eb'}} onClick={deleteBoardHandler}>Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </span>
                    <PopupState variant="popover" popupId="demo-popup-popover">
                        {(popupState) => (
                            <div>
                            <TextField variant='outlined' type='none' {...bindTrigger(popupState)} className='boardselect'   InputProps={{endAdornment:<Arrow/>}} style={{backgroundColor:'white', caretColor:'transparent'}} placeholder={currentboard.brd_title}/>
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
                            >
                                <Grid className='boardlist'>
                                    {brddata[0]?.id && brddata?.map((data)=>(
                                        <p style={{cursor:'pointer'}} key={data.id} onClick={()=>{setcurrentboard({brd_title:data.brd_title, id:data.id}); popupState.close(); setBoardTitle(data.brd_title)}}>{data.brd_title}</p>
                                    ))}
                                </Grid>
                            </Popover>
                            </div>
                        )}
                    </PopupState>
                    <div>
                        <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                                <div>
                                <span onClick={()=>{setaddpopup(!addpopup)}} style={{cursor:'pointer'}}  {...bindTrigger(popupState)}>
                                    <Addsvg />
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
                                >
                                    <div className='addboardlist' >
                                        <p className='boardtitle' style={{margin:'0'}} >Enter board title</p>
                                        <TextField variant='outlined' className='boardinput' placeholder='Board Title' onChange={(e)=>setcreateboardinput({boardtitle : e.target.value})}/>
                                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', gap:'10px'}}>
                                            <Button variant='outlined' style={{padding:'4px 23px', textTransform:'inherit'}} onClick={()=>{setaddpopup(!addpopup)}}>Cancel</Button>
                                            <Button style={{backgroundColor:'black', color:'white', textTransform:'inherit', padding:'4px 23px'}} onClick={createBoardhandler} >Create</Button>
                                        </div>
                                    </div>
                                </Popover>
                                </div>
                            )}
                        </PopupState>
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} style={{padding:'2px'}} >
            <Typography
                    style={{width:'max-content', fontSize:'26px', fontWeight:'700'}}
                    onChange={(e)=>{setBoardTitle(e.target.value)}}
                    onClick={handleTitleClick}
                    onBlur={handleBlur}
                    contenteditable="true"
                    variant='h1'>
                    {boardtitle}
            </Typography>
            </Grid>
        </Grid>
        <DragDropContext onDragEnd={onCarddragEnd} >
            <Grid className='boardbody'>
                <List currentboard={currentboard}/>
            </Grid>
        </DragDropContext>
    </section>
  )
}

export default Board