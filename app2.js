var express = require("express"),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var _ = require("underscore");
var usercon = 0;
var userName = [];

app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
    res.redirect("/index.html");
});

io.on('connection', function(socket){
    //Connected, see how many ppl connect, broadcast all username to users
	
    //usercon++;
    io.emit("userconnect",usercon);
    io.emit("usernameall",userName);
    
    //Fire upon reload to remove the username in arrays
    socket.on('trigger',function(dc){
        var indexxx = userName.indexOf(dc);
        userName.splice(indexxx,1);
    });
    
    //Disconnect event
    socket.on('disconnect', function(){
        //usercon--;
        //io.emit("userconnect",usercon);
		io.emit("usernameall",userName);
    });
    
    //Fire upon user input a username fields,push into arrays and broadcast to other users
    socket.on('username',function(sas){
        //console.log(sas);
        userName.push(sas);  
		io.emit("usernameall",userName);
        //io.emit("appending",sas);   
    });
    
    //JAMMING
    socket.on('chat message', function(msg){
        //console.log(msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
