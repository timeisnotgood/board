import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import { Button, Grid, InputAdornment, MenuItem, Select, TextField } from '@material-ui/core'
import Nav from '../../Components/navbar/Nav';
import { ReactComponent as Deletesvg } from './svg/delete.svg'
import { ReactComponent as Addsvg } from './svg/add.svg'
import { ReactComponent as Dots } from './svg/dot.svg'
import { ReactComponent as Arrow } from './svg/inputarrow.svg'
import axios from 'axios'
import { useSelector } from 'react-redux';



const Board = () => {

    const [boardpopup, setboardpopup] = useState(false);
    const [addpopup, setaddpopup] = useState(false);
    const [deletepopup, setdeletepopup] = useState(false);
    const [boarddata, setboarddata] = useState();
    const [userdata, setuserdata] = useState();
    const userData = useSelector(s=>s);
    const [currentboard, setcurrentboard] = useState({
        brd_title:'',
        id:''
    })

    const [carddatas, setcarddatas] = useState();


    // get User

    useEffect(async()=>{
        setuserdata(userData);
        const id = userData.auth.id;
        const boards = await axios.get(`http://localhost:5000/board/getboard/${id}`,
            {
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            }
        );
        setboarddata(boards.data)
    },[ ])


    // get Single board

    useEffect(async()=>{
        if(currentboard.brd_title != '' && currentboard.id != ''){
            const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            })
            console.log(currentboardlists);
            const list = currentboardlists.data[0].list;
            setcarddatas(list);
        }   
    },[currentboard])

    // Delete boards handler

    const deleteBoardHandler = async() =>{
        console.log(currentboard);
        try {
            const deleteBoard = await axios.delete(`http://localhost:5000/board/deleteboard/${currentboard.id}`,{
                headers:{
                    "Authorization":localStorage.getItem('accesstoken')
                }
            });
            console.log("deleted successfully");
        } catch (error) {
            console.log(error);
        }
    }

    // ----------------------------

    // Create boards Handler

    const [createboardinput, setcreateboardinput] = useState({boardtitle:''})
    const createBoardhandler = async() =>{
        
        console.log(createboardinput);
    }

  return (
    <section className='board'>
        <Nav/>
        {
            deletepopup &&
            <div className='deleteback' onClick={()=>{setdeletepopup(!deletepopup)}}>
            <div className='deletepopup'>
                <p>Are you sure you want to delete this Board?</p>
                <div>
                <Button variant='outlined' onClick={()=>{setdeletepopup(!deletepopup)}}>Cancel</Button>
                <Button color='primary' variant='contained' style={{backgroundColor:'#2563eb'}} onClick={deleteBoardHandler}>Delete</Button>
                </div>
            </div>
            </div>
        }
        <Grid container className='boardnav' >
            <Grid item xs={12} sm={6} style={{padding:'2px'}}>
                <div className='boardactions'>
                    <span onClick={()=>{setdeletepopup(!deletepopup)}} style={{cursor:'pointer'}}>
                        <Deletesvg/>
                    </span>
                        <TextField variant='outlined' type='none' className='boardselect' onClick={()=>{setboardpopup(!boardpopup)}}  InputProps={{endAdornment:<Arrow/>}} style={{backgroundColor:'white', caretColor:'transparent'}} placeholder={currentboard.brd_title}/>
                        {boardpopup && 
                            <div className='boardlist'>
                                {boarddata.map((data)=>(
                                    <p style={{cursor:'pointer'}} key={data.id} onClick={()=>{setcurrentboard({brd_title:data.brd_title, id:data.id}); setboardpopup(!boardpopup);}}>{data.brd_title}</p>
                                ))}
                            </div>
                        }
                <div>
                        <span onClick={()=>{setaddpopup(!addpopup)}} style={{cursor:'pointer'}}>
                        <Addsvg />
                        </span>
                        { addpopup &&
                            <div className='addboardlist'>
                                <p className='boardtitle' style={{margin:'0'}} >Enter board title</p>
                                <TextField variant='outlined' className='boardinput' placeholder='Board Title' onChange={(e)=>setcreateboardinput(e.target.value)}/>
                                <div style={{display:'flex', flexDirection:'row', gap:'10px'}}>
                                    <Button variant='outlined' style={{padding:'4px 23px', textTransform:'inherit'}} onClick={()=>{setaddpopup(!addpopup)}}>Cancel</Button>
                                    <Button style={{backgroundColor:'black', color:'white', textTransform:'inherit', padding:'4px 23px'}} onClick={createBoardhandler} >Create</Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} style={{padding:'2px'}}>
                <h1 className='mainboardtitle'>{currentboard.brd_title}</h1> 
            </Grid>
        </Grid>
        <Grid className='boardbody'>
            <div className='boardinner'>
                {carddatas?.length > 0 && carddatas.map((data, index)=>(
                            <div className='boardcard' key={index} >
                                <div className='cardnav'>
                                    <h6>{data.list_title}  <span>({data.cards ? data.cards.length : 0})</span></h6>
                                    <Dots/>
                                </div>
                                <div className='cardbody'>
                                {data.cards ?  data.cards.map((innerdata, index)=>(
                                        <p className='cardlist' key={index}>
                                            {innerdata}
                                        </p>
                                    )) : null}
                                </div>
                                <div className='addlist'>
                                    <h6>+ Add a card</h6>
                                </div>
                            </div>
                ))}
                <div className='listbutton'>
                    <span>+ Add another list</span>
                </div>
            </div>
        </Grid>
    </section>
  )
}

export default Board