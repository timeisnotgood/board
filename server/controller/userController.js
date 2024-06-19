const knex = require('../knex/knexfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const login = async(req, res) =>{
    const { email, password } = req.body;
    if( !email && !password ){
        res.sendStatus(400)
        throw new Error(" All Fields are mandatory !! ")
    }

    const data = await knex('user').where({'email':email});
    console.log(data);
    
    if(data == ''){
        res.status(404).json({"status":"User not registered !!"})
        return;
    }
    else{
        if(data != '' && (await bcrypt.compare(password, data[0].password))){
            const accesstoken = jwt.sign({
                user:{
                    username : data[0].username,
                    email : data[0].email,
                    id : data[0].id
                },
            }, process.env.your_jwt_secret_key, {expiresIn:"10m"})
            console.log(accesstoken);
    
            res.json({"status" : "Loged in successfully ","accesstoken":accesstoken})
        }else{
            res.json({"error" : "Incorrect Password"})
        }
    }
}

const signup = async(req, res) =>{
    try {
        const {username, email, password} = req.body;
        console.log(req.body);
        const existinguser = await knex('user').where({'email':email});

        if (existinguser != '') {
            res.status(409).json({"status":"user already exist !!"})
            return;
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const createduser = await knex('user').insert({
            "username" : username,
            'email' : email,
            'password' : hashedPassword
        });
        res.json({"status" : "user Created",createduser})
    } catch (error) {
        res.json(error)
    }
}

module.exports = {login, signup};