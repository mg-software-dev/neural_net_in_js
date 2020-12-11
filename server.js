

const fs = require('fs');
const path = require("path");
const express = require('express');
const app = express();
var cors = require('cors');


const serverPort = process.env.PORT || 3001;

const publicFolder = path.join(__dirname,"./public");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicFolder));
app.use(cors());




app.get("/get_trained_data",(req,res)=>
{

    let txt_data = "";

    let readStream = fs.createReadStream("./public/trained_net_data.txt", 'utf8');
    
    readStream.on('data', function(chunk)
    {
        txt_data += chunk;
    }).on('end', function()
    {
        console.log("The file was read!");
        // console.log(txt_data);
        res.send(txt_data);
    });


});









// app listener
app.listen(serverPort, ()=>
{
    console.log(`app is listening on port ${serverPort} `);
});