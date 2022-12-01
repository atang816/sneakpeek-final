const express = require("express")
const cors = require("cors")
const app = express()
const pool = require("./db");


app.use(cors())

app.get("/shoes", async (req, res) => {
    try{
        console.log("works")


        let { name } = req.query
        name = "'" + name + "'"
        const shoes = await pool.query("SELECT * FROM shoe_data WHERE shoe_name = " + name)
        res.json(shoes.rows)
        

    }
    catch (err){
        console.log(err.message)
    }
})

app.get("/shoesDesc", async (req, res) => {
    try{
        console.log("works")


        let { nameDesc } = req.query
        nameDesc = "'" + nameDesc + "'"
        const shoesInfo = await pool.query("SELECT * FROM shoe_data WHERE description = " + nameDesc)
        res.json(shoesInfo.rows)
        
    }
    catch (err){
        console.log(err.message)
    }
})

app.get("/goatShoesDesc", async (req, res) => {
    try{
        console.log("works")


        let { goatNameDesc } = req.query
       
        goatNameDesc = "'" + goatNameDesc + "'"
        console.log(goatNameDesc + "asdasd")

        const goatShoesInfo = await pool.query("SELECT * FROM shoe_data_goat WHERE description = " + goatNameDesc)
        console.log(goatShoesInfo)
        res.json(goatShoesInfo.rows)
        
    }
    catch (err){
        console.log(err.message)
    }
})

app.listen(5001, () => {
    console.log("started on port 5001")
})