const expressAsyncHandler = require('express-async-handler');
const knex = require("../knex/knexfile");


const getList = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query
    console.log("*********", id);
    if(!id) return res.status(404).json({"error" : "Board is mandatory to get list"})
    try {
        const list = await knex('list').select().where({'brd_id' : id,"delete_flag" : 0});
        res.status(200).json(list);
    } catch (error) {
        res.json(error)
    }
});


const createList = expressAsyncHandler(async(req, res) =>{
    const {listTitle, boardId, cardOrder} = req.body;

    if(!listTitle || !boardId) return res.status(404).json({"Error" : "All Fileds are mandatory"});

    try {
        const createList = await knex('list').insert({
            "list_title" : listTitle,
            "brd_id" : boardId,
            "card_order" : cardOrder == "" ? null : cardOrder
        });

        res.status(200).json(createList);
    } catch (error) {
        res.json(error);
    }
})

const updateList = expressAsyncHandler(async(req, res) =>{
    const {id} = req.query;
    const {listTitle} = req.body;

    if (!listTitle) return res.status(404).json({"error" : "all field are mandatory"});

    const currentDate = new Date();

    const existingList = await knex('list').select().where({"id" : id});
    try{
        console.log("secod");
        console.log("********",existingList);

        if(existingList){
            const updatedList = await knex('list').where({"id":id}).update({
                "list_title" : listTitle,
                "updated_at" : currentDate
            })
            res.status(200).json(updatedList);
        }
    } catch (error) {
        res.json(error);
    }
})

const deleteList = expressAsyncHandler(async(req, res) =>{
    const {id} = req.query;
    const currentDate = new Date();


    const existingList = await knex('list').select().where({"id" : id});
    try{

        if(existingList){
            const updatedList = await knex('list').where({"id":id}).update({
                "delete_flag" : 1,
                "updated_at" : currentDate
            })
            res.status(200).json(updatedList);
        }
    } catch (error) {
        res.json(error);
    }
})

const updatecardOrder = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    const {cardOrder} = req.body;
    const currentDate = new Date();
    
    try {
        const existingBoard = await knex('list').select().where({"id" : id});
        if (existingBoard == "") {
            res.json({"Error" : "list cant be Found"});
        }else{
            const updateBoard = await knex('list').where({id:id})
            .update({
                "card_order": cardOrder,
                "updated_at" : currentDate
            });
            res.status(200).json(updateBoard);
        }
    } catch (error) {
        res.json(error);
    }
})

module.exports = { getList, createList, updateList, deleteList, updatecardOrder};