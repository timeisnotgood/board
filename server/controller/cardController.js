const knex = require('../knex/knexfile')
const expressAsyncHandler = require("express-async-handler");


// card Controles

const getCard = expressAsyncHandler(async(req, res)=>{
    try {
        const cards = await knex('card').select();
        res.status(200).json(cards);
    } catch (error) {
        res.json(error);
    }
})

const createCard = expressAsyncHandler(async(req, res) =>{
    const {discussion, listId} = req.body;

    try {
        const createdcard = await knex('card').insert({
            "discussion" : discussion,
            "list_id" : listId
        });
        res.status(200).json(createdcard);
    } catch (error) {
        res.json(error);
    }
    res.json({"status" : "working"});
})

const updateCard = expressAsyncHandler(async(req, res) =>{
    const {id} = req.query;
    const {discussion} = req.body;
    const currentDate = new Date();

    try {
        const existingcard = await knex('card').select().where({"id" : id});
        console.log(existingcard);
        if(existingcard){
            const updatedCard = await knex('card').where({"id":id}).update({
                "discussion" : discussion,
                "updated_at" : currentDate
            });
            res.status(200).json(updatedCard);
        }
    } catch (error) {
        res.json(error);
    }
})

const deleteCard = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    const currentDate = new Date();
    console.log("delete", id);
    try {
        const existingcard = await knex('card').select().where({"id" : id});
        if (existingcard) {
            const updatedCard = await knex('card').where({"id":id}).update({
                "delete_flag" : 1,
                "updated_at" : currentDate
            });
            res.status(200).json(updatedCard);
        }
    } catch (error) {
        res.json(error)
    }
})

// Cmt Controller

const getComment = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    if (!id) {
        res.status(200).json({"Error" : "no card found to cmt"});
    }
    try {
        const comments = await knex('cmt').select().where({"card_id":id});
        res.status(200).json(comments);
    } catch (error) {
        res.json(error);
    }
})

const createComment = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    const {comment} = req.body;
    if (!id) res.status(200).json({"Error" : "no card found to cmt"});
    if (!comment) res.status(200).json({"Error" : "Enter a Comment"});

    try {
    const existingcard = await knex('card').select().where({"id" : id});
        if (existingcard == "") {
            res.status(404).json({"Error" : "card not found"})
        } else {
            const createdCmt = await knex('cmt').insert({
                "comment":comment,
                "card_id":id
            })
            res.status(200).json(createdCmt);
        }
    } catch (error) {
        res.json(error);
    }
})

const updateComment = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    const {commentid, comment} = req.body;
    const currentDate = new Date();

    try {
        const existingcard = await knex('card').select().where({"id" : id});
        const existingcmt = await knex('cmt').select().where({"id" : id});
        if (existingcard == "" || existingcmt == "") {
            res.json({"Error":"cant find card or cmt"});
        }else{
            const updatedCmt = await knex('cmt').where({"id" : commentid}).update({
                "comment" : comment,
                "updated_at" : currentDate
            })
            res.status(200).json(updatedCmt);
        }
    } catch (error) {
        res.json(error);
    }
})

const deleteComment = expressAsyncHandler(async(req, res)=>{
    const {id} = req.query;
    const {commentid} = req.body;
    const currentDate = new Date();

    try {
        const existingcard = await knex('card').select().where({"id" : id});
        const existingcmt = await knex('cmt').select().where({"id" : id});

        if (existingcard == "" || existingcmt == "") {
            res.json({"Error":"cant find card or cmt"});
        }else{
            const deletedCmt = await knex('cmt').where({"id" : commentid}).update({
                "delete_flag" : 1,
                "updated_at" : currentDate
            })
            res.status(200).json(deletedCmt);
        }

    } catch (error) {
        res.json(error);
    }
})

module.exports = { getCard, createCard, updateCard, deleteCard,
                    getComment, createComment, updateComment, deleteComment
};