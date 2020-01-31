//Dependencies
http = require("http");
fs = require("fs");

//Setting port
PORT = 8080;

//Create Server
server = http.createServer(handleRequest);

//Function for handling requests and response coming into the server
function handleRequest (req, res) {
//using fs to read html
    fs.readFile(__dirname + "/index.html", function(err,data){
        if (err) throw err;
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data);
    })
}

//Starting Server
server.listen(Port, function(){
    console.log("Server is listenings on PORT: " + Port);
});