const knex = require("../knex/knexfile");

const getList = async(req, res)=>{
    try {
        const {id} = req.query
        if(!id) return res.status(404).json({"error" : "Board is mandatory to get list"})
        const list = await knex('list').select().where({'brd_id' : id,"delete_flag" : 0});

        res.status(200).json(list == [] ? {"status":"No data found"} : list);
    } catch (error) {
        res.json(error)
    }
};


const createList = async(req, res) =>{
    
    try {
        const {listTitle, boardId, cardOrder} = req.body;
        if(!listTitle || !boardId) return res.status(404).json({"Error" : "All Fileds are mandatory"});
        const createList = await knex('list').insert({
            "list_title" : listTitle,
            "brd_id" : boardId,
            "card_order" : cardOrder
        });
        
        const listId = JSON.parse(...createList);
        console.log(listId);

        // const getlistID = await knex('list').select('id').where({
        //     "list_title" : listTitle,
        //     "brd_id" : boardId,
        //     "card_order" : cardOrder
        // })
        // const listId = getlistID[0].id // list ID

        console.log("list is : ", listId);
        const listOrder = await knex('board').select('list_order').where({"id" : boardId})
        const existinglist = JSON.parse(listOrder[0].list_order)
        console.log("existing array : ", existinglist);
        const currentDate = new Date();

        if (existinglist !=null || existinglist == "") {
            const updatedarray = [...existinglist, listId];
            console.log("updated array : ", updatedarray);
            const newarray = await knex('board').where({"id":boardId}).update({
                "list_order" : JSON.stringify(updatedarray),
                "updated_at" : currentDate
            });
        }else{
            const newlistarray = [listId];
            const newarray = await knex('board').where({"id":boardId}).update({
                "list_order" : JSON.stringify(newlistarray)
            });
        }
        res.status(200).json({"Status":"list created"});
    } catch (error) {
        res.json(error);
    }
}

const updateList = async(req, res) =>{

    try{
        const {id, listTitle} = req.body;
        if (!listTitle) return res.status(404).json({"error" : "all field are mandatory"});
        const currentDate = new Date();
        const existingList = await knex('list').select().where({"id" : id});

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
}

const deleteList = async(req, res) =>{

    try{
        const {id} = req.query;
        const currentDate = new Date();
        const existingList = await knex('list').select().where({"id" : id});
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
}

const updatecardOrder = async(req, res)=>{
    
    try {
        const {id, cardOrder} = req.body;
        const currentDate = new Date();
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
}

module.exports = { getList, createList, updateList, deleteList, updatecardOrder};