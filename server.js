const mongoose = require('mongoose')
const express = require('express'), http = require('http');
const socketAuthentication = require('./app/middleware/socket');
const messageController = require('./app/controller/messageController')
const userController = require('./app/controller/userConroller')
const cors = require('cors');
var app = express();
app.use(cors());
var server = http.createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});


const port = 8000
const url = 'mongodb://127.0.0.1:27017/chatapplication';

//set application to accept the form data
// app.use(express.urlencoded({extended:false}))
app.use(express.json())

//connection with the mongodb server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log("connecting succesfully...")
}).catch((err) => console.log(err))

const routerInit = require('./app/router/web')
routerInit(app);
io.use(socketAuthentication);
let usersConnected = {}
io.on('connection', (socket) => {

    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("a user disconnected");
        userController().logout(socket.id);
        userController().allUser().then((res) => {
            io.emit('updateUserList', res);
        })

    });

    socket.on('loggedin', (user) => {
        usersConnected[user._id] = socket.id;
        //array of connected clients
        const onlineUsers = Object.keys(io.sockets.sockets)
        console.log(onlineUsers)
        userController().allUser().then((res) => {
            res.forEach(element => {
                element['status'] = onlineUsers.includes(element._id) ? true : false
            });
            socket.emit('updateUserList', res);
        })
    })

    // fro tying status
    socket.on('typing', function (data) {
        socket.to(usersConnected[data.receiver]).emit('getTyping', data);

    })


    socket.on('chatMessage', function (data) {
        socket.to(usersConnected[data.receiver]).emit('message', data);
        messageController.saveMessage(data);
    });

    //  socket.on('getHistory',function(data){
    //     //  console.log(data);
    //       messageController.getHistory(data).then(res=>{

    //         //  console.log(res);
    //          socket.emit('getMessages',res);
    //      });
    //     })
});



server.listen(port, () => {
    console.log(`app running on the port: ${port}`)
})
