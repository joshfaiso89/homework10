//Dependencies
const fs = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
//Setting port
const PORT = process.env.PORT || 8080;


//Setting up Express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//static files being served
app.use(express.static("./Develop/public"));


//module.exports(app);


//routes
app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

//Parsing to JSON
app.get('/api/notes', (req, res) => {
    readFile('./Develop/Notes/db.json', 'utf-8').then((data) => { console.log(data);
        data = JSON.parse(data);
        return res.json(data);
    });
});

//Writing new notes to JSON
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    console.log(req.body)

    readFile('./Develop/Notes/db.json', 'utf-8').then((data) => { data = JSON.parse(data);

        data.push(newNote);
        //Appending to json
        data[data.length -1].id = data.length -1;

        //writefile for new json after the push
        writeFile('./Develop/Notes/db.json', JSON.stringify(data));
        res.json(data)
     });
});

//Deleting Notes
app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);

    readFile('./Develop/Notes/db.json', 'utf-8').then((data) => {
        data = JSON.parse(data);

        data.splice(id, 1);

        for (let i = 0; i < data.length; i++) {
            data[i].id = i;
            
        }
    writeFile('./Develop/Notes/db.json', JSON.stringify(data))
    })

    res.send('deleted');
})


//Starting Server
app.listen(PORT, function(){
    console.log("Server is listenings on PORT: " + PORT);
});