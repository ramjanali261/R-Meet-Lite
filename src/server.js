const express= require('express');
const app= express();
const server=require('http').Server(app);

const io =require('socket.io')(server)

const {v4: uuidv4}=require('uuid');

const port=process.env.PORT || 3000;

//peer library import
const { ExpressPeerServer } = require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});

//setting view engine(ejs)
app.set('view engine','ejs');
app.use(express.static('public'));


app.use('/peerjs',peerServer);
//setting the unique id in the url
//--redirecting the home page to room-->with uuid parameter

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/room_ui',(req,res)=>{
    res.redirect(`/room_ui${uuidv4()}`);
})

//setting the unique id in the url
//--redirecting the home page to room-->with uuid parameter
//setting the room id to web address

app.get('/about',(req,res)=>{
    res.render('about');
})

app.get('/:room_ui',(req,res)=>{ 
    res.render('room_ui',{roomId: req.params.room})
})

//socket connection for joining room
io.on('connection',socket =>{
    socket.on('join-room', (roomId,userId)=>{
        // console.log("joined room");
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        // socket.to(roomId).broadcast.emit('user-connected'); //error code 

        socket.on('message',message => {
            io.to(roomId).emit('createMessage',message,userId)
        })

        socket.on('disconnect',()=>{
            console.log(userId)
            socket.to(roomId).emit('user-disconnected',userId);
        })
    })
})


server.listen(port, ()=>{
    console.log(`started port ${port}`)
});
