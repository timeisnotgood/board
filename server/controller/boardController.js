const knex = require('../knex/knexfile')

const getBoard = async(req, res) =>{
    try {
      // const boards = await knex('board as brd')
      // .select(
      //   'brd.brd_title',
      //   knex.raw('(SELECT COUNT(*) FROM list WHERE list.brd_id = brd.id) as list_count')
      // );
      
      // console.log(boards);
      // res.status(200).json(boards);
        const boards = 
        await knex('board as brd')
            .select(
                'brd.brd_title',
                'brd.list_order',
                'lst.list_title',
                'lst.card_order',
                'crd.card_title',
            )
            .leftJoin('list as lst', function () {
                this.on('brd.id', '=', 'lst.brd_id');
            })
            .leftJoin('card as crd', function () {
                this.on('lst.id', '=', 'crd.list_id');
            })
            .where({'brd.delete_flag' : 0});

        const nestedData = transformToNested(boards);
        // console.log(JSON.stringify(nestedData, null, 2));
        // console.log(boards);
        res.status(200).json(nestedData)
        // const boards = await knex('board').select().where({delete_flag : 0});
        // console.log(boards);
        // res.status(200).json(boards)
    } catch (error) {
        console.log("sfsfds",error);
        res.json(error)
    }
}

function transformToNested(data) {
    const result = [];
  
    data.forEach(row => {
      let board = result.find(b => b.board_id === row.board_id);
      if (!board) {
        board = {
          brd_title: row.brd_title,
          list_order: row.list_order,
          lists: []
        };
        result.push(board);
      }
  
      if (row.list_id) {
        let list = board.lists.find(l => l.list_id === row.list_id);
        if (!list) {
          list = {
            list_title: row.list_title,
            card_order: row.card_order
          };
          board.lists.push(list);
        }
      }
    });
  
    return result;
  }

  function transformToNested(data) {
    const result = [];
  
    data.forEach(row => {
      // Find or create the board
      let board = result.find(b => b.brd_title === row.brd_title);
      if (!board) {
        board = {
          brd_title: row.brd_title,
          list_order: JSON.parse(row.list_order),
          lists: []
        };
        result.push(board);
      }
  
      // Find or create the list
      let list = board.lists.find(l => l.list_title === row.list_title);
      if (!list) {
        list = {
          list_title: row.list_title,
          card_order: row.card_order ? JSON.parse(row.card_order) : [],
          cards: []
        };
        board.lists.push(list);
      }
  
      // Add the card to the list
      if (row.card_title) {
        list.cards.push({
          card_title: row.card_title
        });
      }
    });
  
    return result;
  }

const createBoard = async(req, res)=>{
    try {
        const {boardTitle} = req.body;
        if (!boardTitle) return res.json({"error" : "The Title is mandatory"})
        const createBoard = await knex('board').insert({"brd_title" : boardTitle})
        if(createBoard) res.status(200).json({"Status" : "Board created Success fully"})
    } catch (error) {
        res.json(error)
    }
}

const updateBoard = async(req, res) =>{
    try {
        const {id, boardTitle} = req.body;
        const currentDate = new Date();
        if (!boardTitle || !id) return res.json({"error" : "The fileds are mandatory is mandatory"})
        const existingBoard = await knex('board').select().where({"id" : id});
        console.log(existingBoard);
        if(existingBoard == ""){
            res.status(404).json({"error" : "The board doed not exist !!"})
        }else{
            const updateBoard = await knex('board').where({id:id})
            .update({
                "brd_title" : boardTitle,
                "updated_at" : currentDate
            })
            res.status(200).json({"status" : "board updated Successfully"})
        }

    } catch (error) {
        console.log(error);
    }
}

const deleteBoard = async(req, res)=>{
    try {
        const {id} = req.query;
        const currentDate = new Date();
        if (!id) return res.json({"error" : "Id is expected to find Board"})
        const deleteBoard = await knex('board').where({id:id}).update({
            "delete_flag" : 1,
            "updated_at" : currentDate
        })
        const deletelist = await knex('list').where({"brd_id":id}).update({
          "delete_flag" : 1,
          "updated_at" : currentDate
      })
      // const deletecard = await knex('card').where
        res.status(200).json({"status" : "The Board deleted Successfully"})
    } catch (error) {
        res.json(error)
    }
}

const updateListOrder = async(req, res)=>{
    try {
        const {id, listOrder} = req.body;
        const currentDate = new Date();
        const existingBoard = await knex('board').select().where({"id" : id});
        if (existingBoard === "") {
            res.json({"Error" : "Board cant be Found"});
        }else{
            const updateBoard = await knex('board').where({id:id})
            .update({
                "list_order": JSON.stringify(listOrder),
                "updated_at" : currentDate
            });
            res.status(200).json(updateBoard);
        }
    } catch (error) {
        res.json(error);
    }
}


module.exports = { getBoard, createBoard, updateBoard, deleteBoard, updateListOrder };