const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');

const PORT = config.PORT;

//connect to mongodb
const mongoose = require('mongoose');
const MONGODB_URI = config.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

//connect to your collection 
const loves = require('./models/love');

//data handling nice way 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const publicURL = path.resolve(`${__dirname}/public`);

//set up static server
app.use(express.static(publicURL));

//set up static html file
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./views/index.html"));
});

//API endpoints 
// GET: "api/v1/love"
app.get("/api/v1/loves", async(req, res) => {
    try {
        const data = await loves.find();
        res.json(data);
    } catch(error){
        console.error(error);
        res.json(error);
    }
});
// POST: "api/v1/loves"
app.post("/api/v1/loves", async(req, res) => {
    try {
        const newData = {
            "love": req.body.love, 
            "day": req.body.day
        }
        const data = await loves.create(newData);
        res.json(data);
    } catch(error){
        res.json(error);
    }
});
// PUT: "api/v1/loves:id"
app.put("/api/v1/loves/:id", async(req, res) => {
    try {
        const updatedData = {
            "love": req.body.love,
            "day": req.body.day
        }
        const data = await loves.findOneAndUpdate({_id: req.params.id}, updatedData, {new:true});
        res.json(data);
    } catch(error){
        res.json(error);
    }
});
// DELETE: "api/v1/loves:id"
app.delete("/api/v1/loves/:id", async(req, res) => {
    try {
        const deletedDocument = await loves.findOneAndDelete(req.params.id);
        res.json({"message":"removed", "data": JSON.stringify(deletedDocument)});
    } catch(error){
        res.json({error: JSON.stringify(error)});
    }
});

//start listening 
app.listen(PORT, () => {
    console.log(`see the magic: http://localhost:${PORT}`);
});