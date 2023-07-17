const express = require("express");
const app = express();
app.use(express.json());
const Redis = require("ioredis");
const { connection } = require("./db");
const { UserRouter } = require("./models/user.routes");
const redis = new Redis();
app.use("/users", UserRouter)

app.listen(8080, async(req,res)=>{
    try{
        await connection;
        console.log("Connected to the Db is successful");
        console.log("Server is running at port 8080")
    }catch(err){
        console.log(err.message);
        res.send(err.message)
    }
    
})