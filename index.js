

const express =require("express");
const {open}= require("sqlite");
const sqlite3 = require("sqlite3");
const path= require('path');
const dbPath=path.join(__dirname,"Login.db");

const cors= require("cors");
const app= express();
app.use(express.json());
app.use(cors())

let database=null;

const initializeDbAndServer=async()=>{
    try{
        database= await open({
            filename:dbPath,
            driver:sqlite3.Database
        })

        app.listen(4000,()=>{
            console.log("Listening port at http://localhost:4000")
        })
    
    }catch(error){
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
  
}

initializeDbAndServer()

app.get("/",(request,response)=>{
    response.send('Welcome Backend Database System')
})

app.get('/users',async(request,response)=>{
    const getUsersQuery=`SELECT * FROM user`
    const data = await database.all(getUsersQuery);
    response.send(data);
})



app.post('/login',async(request,response)=>{
    const {email,password}= request.body;
    const sqlQuery= `SELECT * FROM user WHERE email ="${email}" and password="${password}"`

    const data= await database.get(sqlQuery)

    if (data ===undefined){
        response.send('User not exit')
    }else{
        response.send("Loged in Successfully")
    }

})

app.post('/signup',async(request,response)=>{

    const {username,email,password}= request.body;
    const sqlQuery=`INSERT INTO user(username,email,password)
                                VALUES("${username}","${email}","${password}");
    `;
    await database.run(sqlQuery);
    response.send("user Added Successfully");
})