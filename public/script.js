const socket=io('/');
const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

//try

// var userName=prompt("Enter name: ");
//     //   console.log(userName)
//       var span = document.getElementById('na');
//       span.innerText = span.textContent = `${userName}`;
      

//new peer connection
var peer= new Peer(undefined,{
    path: '/peerjs',
    host:'/',
    port:'443'
});

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    peer.on('call',call =>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream ( video,userVideoStream)
        })
    })

    socket.on('user-connected',(userId)=>{
        connecToNewUser(userId,stream); //defined the function below
    })    

    //message 
    let text = $('input')

$('html').keydown((e)=>{
    if(e.which == 13 && text.val().length !==0) {
        socket.emit('message', text.val());
        text.val('')
    }
})

socket.on('createMessage',message =>{
    $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li><br/>`)
    scrollToBottom()
})

})

//open the peer room
peer.on('open',id =>{
    // console.log(id);
    socket.emit('join-room',ROOM_ID,id);
    
})

//function code connect to user
const connecToNewUser=(userId,stream)=>{
    // console.log(userId); //client sent the user id
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
}


const addVideoStream = (video,stream) =>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

//window size scroll
const scrollToBottom= ()=>{
    let d=$('.main_chat_window');
    d.scrollTop(d.prop("scrollheight"));
}

const scrollToBot= ()=>{
    let d=$('.chat-area');
    d.scrollTop(d.prop("scrollheight"));
}
//message
const sendmes= ()=>{
    var msg = document.getElementById("chat_message").value;
    if(msg.length !==0) {
        socket.emit('message', msg);
    }

}

//mute our video
const muteUnmute= ()=>{
    const enabled= myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton =()=>{
    const html=`<i class="fa fa-microphone"></i>`

    document.querySelector('.main_mute_button').innerHTML=html;
}

const setUnmuteButton =()=>{
    const html=`<i class="unmute fa fa-microphone-slash"></i>`

    document.querySelector('.main_mute_button').innerHTML=html;
}

//stop video
const playStop=()=>{
    // console.log('object')
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo()
    }else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}

const setStopVideo =()=>{
    const html=`<i class=" fa fa-video"></i>`

    document.querySelector('.main_video_button').innerHTML=html;
}

const setPlayVideo =()=>{
    const html=`<i class="stopp fa fa-video-slash"></i>`

    document.querySelector('.main_video_button').innerHTML=html;
}