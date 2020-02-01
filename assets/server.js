//Dependencies
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
//Setting port
const PORT = process.env.PORT || 8080;

//Create Server
server = http.createServer(handleRequest);

//Setting up Express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//static files being served
app.use(express.static(path.join(__dirname, "public")));

//Function for handling requests and response coming into the server
function handleRequest (req, res) {
//using fs to read html
    fs.readFile(__dirname + "/index.html", function(err,data){
        if (err) throw err;
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data);
    })
}

//module.exports(app);


//routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes.html", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Parsing to JSON
app.get('/api/notes', (req, res) => {
    readFile('./db/db.json', 'utf-8').then((data) => {
        console.log(data);
        data = JSON.parse(data);
        return res.json(data);
    });
});

//Writing new notes to JSON
app.post('/api/notes', (req, res) => {
    let newNote = req.body;

    readFile('./db/db.json', 'utf-8').then((data) => {
        data = JSON.parse(data);

        data.push(newNote);
        //Appending to json
        data[data.length -1].id = data.length -1;

        //writefile for new json after the push
        writeFile('./db/db.json', JSON.stringify(data));
    });
});

//Deleting Notes
app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
})


//Starting Server
server.listen(PORT, function(){
    console.log("Server is listenings on PORT: " + PORT);
});