const knex = require('../knex/knexfile');
const multer = require('multer');


// Storage

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, '/');
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage : storage});

// upload image

const uploadImage = async(req, res)=>{

    if (!req.files) {
        console.log("No File uploaded !");
    } else {
        console.log(req.files);
        res.status(200).json({"file":req.files});
        return;
    }
    return;
};

// card Controles

const getCard = async(req, res)=>{
    try {
        const cards = await knex('card').select();
        res.status(200).json(cards);
    } catch (error) {
        res.json(error);
    }
}

const createCard = async(req, res) =>{
    
    try {
        const {discussion, listId, cardTitle} = req.body;
        const createdcard = await knex('card').insert({
            "discussion" : discussion,
            "card_title" : cardTitle,
            "list_id" : listId
        });
        const getid = await knex('card').select('id').where({
            "discussion" : discussion,
            "card_title" : cardTitle,
            "list_id" : listId
        })
        const cardId = getid[0].id; // card ID
        console.log("cardID : ",cardId);

        const getcardorder = await knex('list').select('card_order').where({"id" : listId});

        const arr = JSON.parse(getcardorder[0].card_order);
        
        console.log("existing array : ", arr); // card ORder
        if (arr != null || arr == "") {
            const updatedarray = [...arr, cardId];
    
            const cardArray = await knex('list').where({"id":listId}).update({
                "card_order" : JSON.stringify(updatedarray)
            });
            console.log("existing list");
            res.status(200).json({"status":"card list updated"})
        }else{
            console.log("new list");
            const newcard = [cardId];
            const cardArray = await knex('list').where({"id":listId}).update({
                "card_order" : JSON.stringify(newcard)
            });
            res.status(200).json({"status":"new card created"});``
        }
    } catch (error) {
        res.json(error);
    }
}

const cardInterchange = async(req, res)=>{
    try {
        const {id, listId} = req.body;
        const updatedChange = await knex('card').where({"id" : id}).update({
            "list_id" : listId
        })
        res.status(200).json(updatedChange);
    } catch (error) {
        res.json(error);
    }
}

const updateCard = async(req, res) =>{

    try {
        const {cardid, cardTitle} = req.body;
        console.log(cardTitle);
        const currentDate = new Date();
        const existingcard = await knex('card').select().where({"id" : cardid});
        console.log(existingcard);
        if(existingcard){
            console.log(cardTitle);
            const updatedCard = await knex('card').where({"id":cardid}).update({
                "card_title" : cardTitle,
                "updated_at" : currentDate
            });
            res.status(200).json(updatedCard);
        }
    } catch (error) {
        res.json(error);
    }
}



const deleteCard = async(req, res)=>{
    
    try {
        const {id} = req.params;
        const currentDate = new Date();
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
}

//-------------------------------------------------------------------------------------------

// Discussion Controller

const getdiscussion = async(req, res)=>{
    try {
        const {id} = req.params;
        const discussion = await knex('card').where({"id":id}).select('discussion')
        res.status(200).json(discussion)
    } catch (error) {
        res.json(error);
    }
}

const createDiscussion = async(req, res) =>{
    try {
        const { cardId, discussion} = req.body;
        const creatediscussion = await knex('card').where({"id":cardId}).update({
            "discussion" : discussion
        })

        res.status(200).json(creatediscussion);
    } catch (error) {
        res.json(error)
    }
}

// Cmt Controller

const getComment = async(req, res)=>{
    try {
        const {id} = req.params;
        if (!id) res.status(200).json({"Error" : "no card found to cmt"});
        const comments = await knex('cmt').select('comment').where({"card_id":id});
        res.status(200).json(comments);
    } catch (error) {
        res.json(error);
    }
}


const createComment = async(req, res)=>{

    try {
        const {id, comment, userid} = req.body;
        if (!id) res.status(200).json({"Error" : "no card found to cmt"});
        if (!comment) res.status(200).json({"Error" : "Enter a Comment"});
        const existingcard = await knex('card').select().where({"id" : id});
        if (existingcard == "") {
            res.status(404).json({"Error" : "card not found"})
        } else {
            const createdCmt = await knex('cmt').insert({
                "comment":comment,
                "create_by":userid,
                "card_id":id
            })
            res.status(200).json(createdCmt);
        }
    } catch (error) {
        res.json(error);
    }
}

const updateComment = async(req, res)=>{

    try {
        const {id, commentid, comment} = req.body;
        const currentDate = new Date();
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
}

const deleteComment = async(req, res)=>{

    try {
        const {id} = req.params;
        const {commentid} = req.body;
        const currentDate = new Date();
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
}

module.exports = { getCard, createCard, updateCard, deleteCard, cardInterchange,
                    getComment, createComment, updateComment, deleteComment,
                    getdiscussion, createDiscussion, upload, uploadImage
};





