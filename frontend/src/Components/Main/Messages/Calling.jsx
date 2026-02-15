import { useEffect, useRef, useState, useContext } from 'react'
import { io } from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import { Info } from '../Main'

let socket = io("https://pointsell-4.onrender.com", {
    withCredentials: true,
    transports: ['websocket']
})

function Calling() {
    let location = useLocation()
    let navigate = useNavigate()
    let { secondUser, camera, isCaller, incomingOffer } = location.state || {}
    let { curentUser } = useContext(Info)

    let localVideo = useRef()
    let remoteVideo = useRef()
    let peerConnection = useRef()
    let localStream = useRef()
    
    let [cameraOn, setCameraOn] = useState(camera)
    let [micOn, setMicOn] = useState(true)


    // ზარის გათიშვის ფუნქცია
    let endCall = () => {
        socket.emit('end-call', { to: secondUser?.email })
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop())
        }
        if (peerConnection.current) {
            peerConnection.current.close()
        }
        navigate(-1)
    }

    const toggleCamera = () => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach(track => {
                track.enabled = !cameraOn
            })
            setCameraOn(!cameraOn)
        }
    }

    const toggleMic = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach(track => {
                track.enabled = !micOn
            })
            setMicOn(!micOn)
        }
    }

    useEffect(() => {
        if (!secondUser) return

        let initCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                localStream.current = stream
                if (localVideo.current) localVideo.current.srcObject = stream

                stream.getVideoTracks().forEach(t => t.enabled = camera)

                peerConnection.current = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                })

                stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream))

                peerConnection.current.ontrack = (event) => {
                    if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]
                }

                peerConnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('new-ice-candidate', { to: secondUser.email, candidate: event.candidate })
                    }
                }

                if (isCaller) {
                    let offer = await peerConnection.current.createOffer()
                    await peerConnection.current.setLocalDescription(offer)
                    socket.emit('video-offer', { to: secondUser.email, offer: offer, callerData: curentUser })
                } else if (incomingOffer) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingOffer))
                    let answer = await peerConnection.current.createAnswer()
                    await peerConnection.current.setLocalDescription(answer)
                    socket.emit('video-answer', { to: secondUser.email, answer: answer })
                }
            } catch (err) { console.error("Media Error:", err) }
        }

        initCall()

        socket.on('video-answer', async (data) => {
            if (peerConnection.current && peerConnection.current.signalingState !== "closed") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer))
            }
        })

        socket.on('new-ice-candidate', async (data) => {
            if (data.candidate && peerConnection.current && peerConnection.current.signalingState !== "closed") {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
                } catch (e) { console.error(e) }
            }
        })


        socket.on('call-ended', () => {
            if (localStream.current) localStream.current.getTracks().forEach(track => track.stop())
            navigate(-1)
        })

        return () => {
            socket.off('video-answer')
            socket.off('new-ice-candidate')
            socket.off('call-ended')
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [secondUser, isCaller, incomingOffer, curentUser, navigate, camera])

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden gap-3">
            <h2 className="text-black text-2xl font-bold z-20">Calling: {secondUser?.name}</h2>

            <div className="flex gap-10 w-full h-[70vh] px-10 relative z-10">
                <div className="w-1/2 h-full rounded-3xl border-2 border-[#f67f20] bg-cover bg-center bg-no-repeat relative overflow-hidden bg-gray-800 shadow-2xl"
                     style={{ backgroundImage: `url(${curentUser?.profileUrl})` }}>
                    <video ref={localVideo} autoPlay muted playsInline 
                        className={`w-full h-full object-cover transition-opacity duration-500 ${cameraOn ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                <div className="w-1/2 h-full rounded-3xl border-2 border-gray-600 bg-cover bg-center bg-no-repeat relative overflow-hidden bg-gray-800 shadow-2xl"
                     style={{ backgroundImage: `url(${secondUser?.profileUrl})` }}>
                    <video ref={remoteVideo} autoPlay playsInline 
                        className="w-full h-full object-cover" />
                </div>
            </div>

            <div className='mt-10 flex items-center gap-8 z-20'>
                <button onClick={toggleMic} className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${micOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                    <i className={`fa-solid ${micOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                </button>
                
                <button onClick={endCall} className="bg-red-600 text-white w-20 h-20 rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 duration-200 shadow-xl">
                    <i className="fa-solid fa-phone-slash text-2xl"></i>
                </button>

                <button onClick={toggleCamera} className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${cameraOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}>
                    <i className={`fa-solid ${cameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
                </button>
            </div>
        </div>
    )
}
export default Calling