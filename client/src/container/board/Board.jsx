import React, { useEffect, useState } from 'react'
import './style.css'
import { Button, Dialog, DialogActions, DialogContentText, FormControl, Grid, InputAdornment, InputBase, InputLabel, MenuItem, NativeSelect, Popper, Select, TextField, Typography } from '@material-ui/core'
import { ReactComponent as Deletesvg } from './svg/delete.svg'
import { ReactComponent as Addsvg } from './svg/add.svg'
import { ReactComponent as Dots } from './svg/dot.svg'
import { ReactComponent as Arrow } from './svg/inputarrow.svg'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setboarddataredux, setcurrentboarddataredux, setcarddataredux } from '../../redux/actions'
import { ReactComponent as Cross } from './svg/scross.svg'
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import List from '../../Components/boardList';
import { DragDropContext } from 'react-beautiful-dnd'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import LoadingScreen from '../../Components/loadingScreen/LoadingScreen'

const Board = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const myParam = new URLSearchParams(location.search).get('id');
    let currentUrlid = JSON.parse(myParam);

    const [boardpopup, setboardpopup] = useState(null);
    const [addpopup, setaddpopup] = useState(false);
    const [deletepopup, setdeletepopup] = useState(false);
    const userData = useSelector(s=>s);
    const dispatch = useDispatch();

    const brddata = userData.boarddata;
    const usrdata = userData.auth;
    const crddata = userData.cardData;
    const usrid = usrdata.id;
    const currentboardData = userData.currentboardData;


    const [loading, setLoading] = useState(false);
    const [currentboard, setcurrentboard] = useState({
        brd_title:'',
        id:''
    })


    const open = Boolean(boardpopup);
    const id = open ? 'transitions-popper' : undefined;
    const [boardtitle, setBoardTitle] = useState(currentboard.brd_title);


    // get All board

    useEffect(async()=>{


        const boards = await axios.get(`http://localhost:5000/board/getboard/${usrid}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );
        dispatch(setboarddataredux(boards.data))


        if (boards.data[boards.data.length-1]?.brd_title != null && myParam == null) {
            setcurrentboard({
                brd_title: boards.data[boards.data.length-1].brd_title,
                id : boards.data[boards.data.length-1].id
            })
            setBoardTitle(boards.data[boards.data.length-1].brd_title);

            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${boards.data[boards.data.length-1].id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            const board = currentboardlists.data;
            const list = currentboardlists.data[0].list;
            dispatch(setcurrentboarddataredux(board));
            dispatch(setcarddataredux(list));
        }

    },[])

    // get Single board

    useEffect(async()=>{
        if (myParam != null) {
            try {
                setLoading(true);
                const boards = await axios.get(`http://localhost:5000/board/getsingleboard/${currentUrlid}`,
                    {
                        headers:{
                            "Authorization":localStorage.getItem('accesstoken')
                        }
                    }
                );
                let setingcurrentboard = boards.data[0];
                console.log(setingcurrentboard);
                
                setcurrentboard({brd_title : setingcurrentboard.brd_title, id : setingcurrentboard.id})
                setBoardTitle(setingcurrentboard.brd_title);
                
    
                const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentUrlid}`,{
                    headers:{
                        "Authorization":localStorage.getItem('accesstoken')
                    }
                })
                const board = currentboardlists.data
                const list = currentboardlists.data[0].list;
                // console.log("boarddata",board);
                // console.log("listdata",list);
                dispatch(setcurrentboarddataredux(board));
                dispatch(setcarddataredux(list));

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
    },[location])

    // Create boards Handler

    const [createboardinput, setcreateboardinput] = useState({boardtitle:''})
    const createBoardhandler = async() =>{
        const createdBoard = await axios.post(`http://localhost:5000/board/createboard`,{
            boardTitle:createboardinput.boardtitle,
            userId:usrid
        },{
            headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
        })

        setaddpopup(!addpopup);

        const boards = await axios.get(`http://localhost:5000/board/getboard/${usrid}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );

        dispatch(setboarddataredux(boards.data));  
        setcurrentboard({
            brd_title: createboardinput.boardtitle,
            id : createdBoard.data.boardid
        });
        navigate(`/boards?id=${createdBoard.data.boardid}`);
    }

    //------------------------------------------------------------------


    //update Board Title

    const [isEditing, setIsEditing] = useState(false);

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
        dispatch(setboarddataredux(boards.data))   
        console.log("current",boards.data);     
        setcurrentboard({
            brd_title: boardtitle,
            id : currentboard.id
        })
        setIsEditing(false);
    };

    //------------------------------------------------------------------


    // Delete boards handler

    const deleteBoardHandler = async() =>{

        try {
            setLoading(true);
            const deleteBoard = await axios.delete(`http://localhost:5000/board/deleteboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            });
            const boards = await axios.get(`http://localhost:5000/board/getboard/${usrid}`,
                {
                    headers:{
                        "Authorization":localStorage.getItem('accesstoken')
                    }
                }
            );

            dispatch(setboarddataredux(boards.data))
            console.log("****************",boards.data[0].brd_title);
            setcurrentboard({brd_title:boards.data[boards.data.length-1].brd_title, id:boards.data[boards.data.length-1].id})
            setdeletepopup(!deletepopup)
            console.log("deleted successfully");
            navigate(`/boards?id=${boards.data[boards.data.length-1].id}`);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    //---------------------------------------------------------------------


    // Drag and drop For -> both (List & Cards)

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
        const [boarddata] = currentboardData;
        console.log(boarddata);

        if (type == "list") {

            let listOrder = JSON.parse(boarddata.list_order);

            console.log(listOrder);
            listOrder.splice(source.index, 1);
            listOrder.splice(destination.index, 0, JSON.parse(draggableId));

            console.log("listOrder", listOrder);
            console.log("brddata",boarddata);
            let newbrddata = {
                ...boarddata,
                list_order : JSON.stringify(listOrder)
            }
            console.log("updatedBoard",newbrddata);
            dispatch(setcurrentboarddataredux([newbrddata]));

            
            const boards = await axios.post(`http://localhost:5000/board/updatelistorder`,{
                id : destination.droppableId, listOrder : listOrder
            },
                {
                    headers:{
                        "Authorization":localStorage.getItem('accesstoken')
                    }
                }
            );

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

            let currentcardOrder = JSON.parse(currentList.card_order);
            currentcardOrder.splice(source.index, 1);//[56,57]

            const currentlists = {
                ...currentList,
                card_order : JSON.stringify(currentcardOrder),
            }

            console.log("startList", currentlists);

            // Destination list

            let destinationcardorder = JSON.parse(destinationList.card_order);
            destinationcardorder.splice(destination.index, 0, JSON.parse(draggableId));
            
            const [removedcard] = currentList.cards.filter( le => le.card_id == draggableId);
            console.log("Need",destinationList);

            let destinationlists = null;
            if (destinationList.cards != null) {
                destinationList.cards.push(removedcard)
                console.log("removedcard",removedcard);  

                destinationlists = {
                    ...destinationList,
                    card_order:JSON.stringify(destinationcardorder),
                }
            }else{
                destinationlists = {
                    ...destinationList,
                    card_order:JSON.stringify(destinationcardorder),
                    cards : [removedcard]
                }
            }



            console.log("destinationList", destinationList);

            const updatedlistdata = crddata.filter( el => el.list_id != source.droppableId && el.list_id != destination.droppableId);
            

            updatedlistdata.unshift(currentlists);
            updatedlistdata.unshift(destinationlists);
            
            console.log("updatedList", updatedlistdata);

            const list = JSON.parse(currentboardData[0].list_order);
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

    //-------------------------------------------------------------    

  return (
    <section className='board'>
    <LoadingScreen open={loading} />
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
                                        <MenuItem className={currentUrlid == data.id ? '.active' : ''}  key={data.id} id={data.id} onClick={(e)=> {navigate(`/boards?id=${e.target.id}`); popupState.close()}}>{data.brd_title}</MenuItem>
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
                                            <Button variant='outlined' style={{padding:'4px 23px', textTransform:'inherit'}} onClick={()=>{setaddpopup(!addpopup); popupState.close();}}>Cancel</Button>
                                            <Button style={{backgroundColor:'black', color:'white', textTransform:'inherit', padding:'4px 23px'}} onClick={() =>{createBoardhandler(); popupState.close();}} >Create</Button>
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
                    onInput={(e)=>{setBoardTitle(e.target.innerText)}}
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