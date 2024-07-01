import { Button, Grid, Popover, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { ReactComponent as Cross } from './svg/scross.svg'
import { setcarddataredux } from '../../redux/actions'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CardDialog from '../cardPopup';


const Boardcard = ({data, currentboard}) => {

    const dispatch = useDispatch();

    // Card Action  Add card

    const [cardactionpopup, setcardactionpopup] = useState(false);
    const [addnewcardpopup, setaddnewcardpopup] = useState({state:null, id:''});
    const [newcardinput, setnewcardinput] = useState('');

    const open = Boolean(addnewcardpopup.state)
    const id = open ? 'simple-popover' : undefined

    const addnewcardHandler = async(data) =>{


        const createnewcard = await axios.post(`http://localhost:5000/card/createcard`,{
            discussion:null,
            listId:data,
            cardTitle: newcardinput
        },{
           headers:{
                "Authorization":localStorage.getItem('accesstoken')
            } 
        })

        console.log(newcardinput);

        const currentboardlists = await axios.get(`http://localhost:5000/board/getallboard/${currentboard.id}`,{
            headers:{
                "Authorization":localStorage.getItem('accesstoken')
            }
        })
        
        const list = currentboardlists.data[0].list;
        console.log("***************",list);
        dispatch(setcarddataredux(list));
        setaddnewcardpopup(!addnewcardHandler)
    }

    //------------------------------------------------------------------

    // Update Card


    const [isEditing, setIsEditing] = useState(false);
    const [cardTitles, setCardTitles] = useState({
        cardId:'',
        cardtitle : ''
    });

    const handleTitleChange = (cardId, cardTitle) => {
        setCardTitles({
            cardId:cardId,
            cardtitle : cardTitle
        })
    };

    const userData = useSelector(s=>s);

    const handleTitleClick = () => {
      setIsEditing(true);
    };

    
    const handleBlur = async() => {
        const id = userData.auth.id;
        if (cardTitles.cardtitle != '') {
            console.log(cardTitles);

            const updateCardTitle = await axios.put(`http://localhost:5000/card/updatecard`,{
                cardid : cardTitles.cardId, cardTitle : cardTitles.cardtitle
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
            dispatch(setcarddataredux(list));   
            setIsEditing(false);
        }
    };

    //------------------------------------------------------------------


    // card Dialog actoni
    const [Dialogopen, setDialogOpen] = useState(false);
    const [selectedcard, setSelectcard] = useState({
        card_id :'',
        card_title :''
    })

    const handleClickOpen = (data) => {
        setDialogOpen(true);
        setSelectcard({
            card_id:data.card_id,
            card_title:data.card_title
        })
    };
  
    const handleClose = () => {
        setDialogOpen(false);
    };

  return (
    <>
        <div className='cardbody'>
            {data.cards ?  data.cards.map((innerdata, index)=>(
                <div
                    onDoubleClick={()=>handleClickOpen(innerdata)}
                    className='cardlist'
                    key={innerdata.card_id}
                    >
                    <Typography
                        onInput={(e) => handleTitleChange(innerdata.card_id, e.target.innerText)}
                        onClick={handleTitleClick}
                        onBlur={()=>handleBlur(innerdata)}
                        contenteditable='true'
                        variant='p'>
                        {innerdata.card_title}
                    </Typography>
                    <CardDialog Dialogopen={Dialogopen} handleClose={handleClose} selectedcard={selectedcard}/>
                </div>
                )) : null
            }
            <Popover
            open={open}
            id = {id}
            anchorEl={addnewcardpopup.state}
            onClose={()=> setaddnewcardpopup({state:null})}
            className='cardnavactions'
            style={{padding:'8px 0px'}}
            >
                <Grid className='listinputpopup' >
                    <TextField onChange={(e)=>{setnewcardinput(e.target.value)}}/>
                    <Grid className='listinputpopupaction'>
                        <Button onClick={()=>addnewcardHandler(addnewcardpopup.id)}>Add Card</Button>
                        <Cross onClick={()=>setaddnewcardpopup(null)}/>
                    </Grid>
                </Grid>
            </Popover>
        </div>
        <Grid>                                   
            <Grid className='addlist' onClick={(e)=>{setaddnewcardpopup({state:e.currentTarget,id:data.list_id})}}>
                <h6>+ Add a card</h6>
            </Grid>
        </Grid>
    </>
  )
}

export default Boardcard