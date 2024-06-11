const knex = require('../knex/knexfile')
const expressAsyncHandler = require("express-async-handler");


const getBoard = expressAsyncHandler(async(req, res) =>{
    try {
        const boards = await knex('board').select().where({delete_flag : 0});
        console.log(boards);
        res.status(200).json(boards)
    } catch (error) {
        res.json(error)
    }
})

const createBoard = expressAsyncHandler(async(req, res)=>{
    const {boardTitle} = req.body;
    if (!boardTitle) return res.json({"error" : "The Title is mandatory"})
    console.log("**********************",boardTitle);
    try {
        const createBoard = await knex('board').insert({"brd_title" : boardTitle})
        if(createBoard) res.status(200).json({createBoard})
    } catch (error) {
        res.json(error)
    }
})

const updateBoard = expressAsyncHandler(async(req, res) =>{
    const {id} = req.query;
    const {boardTitle} = req.body;

    const d = new Date();
    console.log("**************", id);

    if (!boardTitle || !id) return res.json({"error" : "The fileds are mandatory is mandatory"})
    console.log(id,"**********************",boardTitle);

    try {
        const existingBoard = await knex('board').select().where({"id" : id});
        console.log(existingBoard);
        if(existingBoard){
            const updateBoard = await knex('board').where({id:id})
            .update({
                "brd_title" : boardTitle,
                "updated_at" : d})
            res.status(200).json(updateBoard)
        }else{
            res.status(404).json({"error" : "The board doed not exist !!"})
        }

    } catch (error) {
        console.log(error);
    }
})

const deleteBoard = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;

    if (!id) return res.json({"error" : "Id is expected to find Board"})
    console.log("**********************",id);

    try {
        const deleteBoard = await knex('board').where({id:id}).update({
            "delete_flag" : 1
        })
        res.status(200).json({"status" : "The Board deleted Successfully"})
    } catch (error) {
        res.json(error)
    }
})

module.exports = { getBoard, createBoard, updateBoard, deleteBoard };