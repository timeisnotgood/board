const knex = require('../knex/knexfile')

const getallBoards = async(req, res) =>{
    try {
        console.log("*********",req.user);
        const {id} = req.params;

        const boards = 
        await knex('board as brd')
        .where({"brd.id":id})
            .select(
                'brd.brd_title',
                'brd.id',
                'brd.created_at',
                'brd.list_order',
                knex.raw(` JSON_ARRAYAGG(JSON_OBJECT(
                  'list_title', lst.list_title,
                  'card_order',lst.card_order,
                  'list_id',lst.id,
                  'cards', (
                     SELECT JSON_ARRAYAGG(JSON_OBJECT('card_title',crd.card_title, 'card_id',crd.id))
                      FROM card crd
                      WHERE crd.list_id = lst.id
                      and crd.delete_flag = 0
                      ORDER BY lst.card_order
                  )
                 )) AS list`)
            )
            .leftJoin('list as lst', function () {
                this.on('brd.id', '=', 'lst.brd_id').on('lst.delete_flag', '=', 0);
            })
            .groupBy('brd.id')          
            .where({'brd.delete_flag' : 0});

        res.status(200).json(boards);
    } catch (error) {
        res.json(error);
    }
}

// SELECT JSON_ARRAYAGG(JSON_OBJECT('card_title',crd.card_title,'card_id',crd.id))

const getBoard = async(req, res) =>{
  try {

    const {id} = req.params;
    console.log("*****************",id);
      const boards = 
      await knex('board as brd')
      .where({"brd.create_by":id})
          .select(
              'brd.brd_title',
              'brd.id',
              'brd.created_at',
              'brd.list_order',
              knex.raw(` JSON_ARRAYAGG(JSON_OBJECT(
                'list_title', lst.list_title,
                'card_order',lst.card_order,
                'list_id',lst.id,
                'cards', (
                     SELECT JSON_ARRAYAGG(JSON_OBJECT('card_title',crd.card_title, 'card_id',crd.id))
                    FROM card crd
                    WHERE crd.list_id = lst.id
                    ORDER BY lst.card_order
                )
               )) AS list`)
          )
          .leftJoin('list as lst', function () {
              this.on('brd.id', '=', 'lst.brd_id').on('lst.delete_flag', '=', 0);
          })
          .groupBy('brd.id')          
          .where({'brd.delete_flag' : 0});

    //   console.log("******************",boards);
      res.status(200).json(boards)

  } catch (error) {
      console.log("sfsfds",error);
      res.json(error)
  }
}

const singleboard = async(req, res) =>{
    try {
        const {id} = req.params;
        console.log(id);
        const singleboard = await knex('board as brd')
        .where({"id":id})
        .select("brd.brd_title",
            "brd.id"
        )

        res.status(200).json(singleboard);
    } catch (error) {
        res.json(error);
    }
}

const createBoard = async(req, res)=>{
    try {
        const {boardTitle, userId} = req.body;
        if (!boardTitle) return res.json({"error" : "The Title is mandatory"})
        const createBoard = await knex('board').insert({"brd_title" : boardTitle, "create_by" : userId})
        const [boardid] = createBoard
        if(createBoard) res.status(200).json({"Status" : "Board created Success fully","boardid": boardid})
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
        const {id} = req.params;
        const currentDate = new Date();
        if (!id) return res.json({"error" : "Id is expected to find Board"})
        const deleteBoard = await knex('board').where({id:id}).update({
            "delete_flag" : 1,
            "deleted_at" : currentDate
        })
        const deletelist = await knex('list').where({"brd_id":id}).update({
          "delete_flag" : 1,
          "deleted_at" : currentDate
          })
          
          const list = await knex('list').select('id').where({"brd_id":id});
          const ids = list.map(({ id }) => id);
          console.log(ids);

          const card = await knex('card').whereIn('list_id',ids).update({
            "delete_flag" : 0,
            "deleted_at" :currentDate
          });
          // not working

        //   console.log("************************");
          const cardlist = await knex('card').select('id').whereIn('list_id' , ids)
          const cds = cardlist.map(({ id }) => id);
          console.log("*********",cds);

          const cmt = await knex('cmt').whereIn('card_id', cds).update({
            "delete_flag" : 0,
            "deleted_at" :currentDate
          })
        res.status(200).json({"status" : "current board deleted"})
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


module.exports = { getBoard, createBoard, updateBoard, deleteBoard, updateListOrder, getallBoards, singleboard };