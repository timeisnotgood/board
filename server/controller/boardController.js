const knex = require('../knex/knexfile')

const getallBoards = async(req, res) =>{
  const boards = await knex('board').select('brd_title').where({"delete_flag" : 0});
  res.status(200).json(boards);
}

const getBoard = async(req, res) =>{
  try {
    const {id} = req.query;
      const boards = 
      await knex('board as brd')
      .where({"brd.id":id})
          .select(
              'brd.brd_title',
              'brd.list_order',
              knex.raw(` JSON_ARRAYAGG(JSON_OBJECT(
                'list_title', lst.list_title,
                'card_order',lst.card_order,
                'cards', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'card_title', crd.card_title
                        )
                    )
                    FROM card crd
                    WHERE crd.list_id = lst.id
                    ORDER BY lst.card_order
                )
               )) AS list`)
          )
          .leftJoin('list as lst', function () {
              this.on('brd.id', '=', 'lst.brd_id');
          })
          .groupBy('brd.id')          
          .where({'brd.delete_flag' : 0});

      console.log(boards);
      res.status(200).json(boards)

  } catch (error) {
      console.log("sfsfds",error);
      res.json(error)
  }
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

          console.log("************************");
          const cardlist = await knex('card').select('id').whereIn('list_id' , ids)
          const cds = cardlist.map(({ id }) => id);
          console.log("*********",cds);

          const cmt = await knex('cmt').whereIn('card_id', cds).update({
            "delete_flag" : 0,
            "deleted_at" :currentDate
          })


        // for (let i = 0;  i< list.length; i++) {
        //   console.log(list[i].id);
        //   const card = await knex('card').where({"list_id":list[i].id}).update({
        //       "delete_flag" : 1,
        //       "deleted_at" : currentDate
        //   })
        // const cardid = await knex('card').select('id').where({"list_id":id});
        // for (let j = 0; j < array.length; j++) {
        //   const cmt = await knex('cmt').where({"card_id" : cardid[i].id}).update({
        //     "delete_flag" : 1,
        //     "deleted_at" : currentDate
        //   })          
        // }
        // }
        res.status(200).json(list)
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


module.exports = { getBoard, createBoard, updateBoard, deleteBoard, updateListOrder, getallBoards };