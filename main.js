const APP_ID = "e8cd0e7215364a9b8c28f7288b8f841b";


let token =null;
let uid=String(Math.floor(Math.random()*10000))

let client;
let channel;

let localStream;
let remoteStream;
let peerconnection;
const server={
 iceServers:[
    {
       urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
 ]
}
let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID);
await client.login({uid,token})
channel=client.createChannel('main')
await channel.join()

channel.on('MemberJoined',handleUserJoined)

    localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
    document.getElementById('user1').srcObject = localStream 
    createOffer()
}

let handleUserJoined=async(MemberId)=>{
    console.log('A new User Joined the channel ',MemberId)
}

let createOffer =async ()=>{
    peerconnection= new RTCPeerConnection(server)

    remoteStream = new MediaStream()
    document.getElementById('user2').srcObject = remoteStream 

     localStream.getTracks().forEach((track)=>{
        peerconnection.addTrack(track,localStream)
     })

    peerconnection.ontrack=(event)=>{
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track)
        })
    }
    peerconnection.onicecandidate=async(event)=>{
        if(event.candidate){
            console.log('New ICE candidates',event.candidate)
        }
    }
    let offer= await peerconnection.createOffer()
    await peerconnection.setLocalDescription(offer)
    console.log('Offer',offer)
}
init();