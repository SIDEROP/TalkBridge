import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
} from "../Store/app/slicess/socketSlice";
import {
  setPeerConnect,
  setLocalStream,
  setRemoteStream,
  setCallId,
  setIncoming,
  setOutgoingCall,
  startTimer,
  stopTimer,
} from "../Store/app/slicess/streamSlice";
import { allUsersSet } from "../Store/app/slicess/authSlice";

const RtcConnection = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { authenticated, userData } = useSelector((state) => state.auth?.auth);
  const {
    localStream,
    remoteStream,
    isCallId,
    incomingCall,
    outgoingCall,
    isMuted,
    isVideoStopped,
  } = useSelector((state) => state.stream);

  useEffect(() => {
    if (authenticated && !socket) {
      dispatch(
        connectSocket({ userId: userData?._id, userName: userData?.name })
      );
    }
    return () => {
      if (authenticated && socket) {
        dispatch(disconnectSocket());
      }
    };
  }, [dispatch, authenticated, socket, userData]);

  useEffect(() => {
    if (!socket || !authenticated) return;

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    socket.on("new_ice_candidate", (candidate) => {
      if (candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    dispatch(setPeerConnect(peerConnection));

    socket.on("offer", async ({ offer, senderId, userName }) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        dispatch(
          setIncoming({
            callerName: userName,
            userId: senderId,
            show: true,
            action: "normal",
          })
        );
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket.on("answer", async (answer) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        dispatch(
          setOutgoingCall({
            ...outgoingCall,
            show: false,
          })
        );
        dispatch(
          setIncoming({
            callerName: null,
            userId: null,
            show: false,
            action: "normal",
          })
        );
        dispatch(startTimer());
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    peerConnection.ontrack = (event) => {
      dispatch(setRemoteStream(event.streams[0]));
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("new_ice_candidate", {
          candidate: event.candidate,
          targetUserId: isCallId,
        });
      }
    };

    const createAndSendOffer = async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("send_offer", {
          offer,
          targetUserId: isCallId,
          senderId: userData._id,
          userName: userData.name,
        });
      } catch (err) {
        console.error("Error creating and sending offer:", err);
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        dispatch(setLocalStream(stream));
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
        createAndSendOffer();
      })
      .catch((err) => {
        console.error("Error accessing local media:", err);
      });

    socket.on("connect", () => {
      socket.emit("connect_user", {
        userId: userData?._id,
        name: userData?.name,
      });
    });

    socket.on("userListData", (userListStatus) => {
      dispatch(
        allUsersSet(
          Object.entries(userListStatus).map(([id, value]) => ({
            id: id,
            ...value,
          }))
        )
      );
    });

    socket.on("call_declined", () => {
      console.log("Call declined by the receiver.");
      dispatch(stopTimer());
      dispatch(setCallId(null));
      dispatch(
        setOutgoingCall({
          callerName: null,
          userId: null,
          show: false,
          action: "callend",
        })
      );
      dispatch(
        setIncoming({
          callerName: null,
          userId: null,
          show: false,
          action: "normal",
        })
      );

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        dispatch(setLocalStream(null));
      }

      if (remoteStream) {
        dispatch(setRemoteStream(null));
      }
    });

    socket.on("call_ended", () => {
      console.log("Call ended by the other user.");
      dispatch(stopTimer());
      dispatch(setCallId(null));
      dispatch(
        setIncoming({
          callerName: null,
          userId: null,
          show: false,
          action: "decline",
        })
      );
      dispatch(
        setOutgoingCall({
          callerName: null,
          userId: null,
          show: false,
          action: "normal",
        })
      );

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        dispatch(setLocalStream(null));
      }

      if (remoteStream) {
        dispatch(setRemoteStream(null));
      }
    });

    socket.on("isMuted", ({ isMuted }) => {
      if (!isMuted) {
        dispatch(
          setIncoming({
            ...incomingCall,
            action: "mute",
          })
        );
      } else {
        dispatch(
          setIncoming({
            ...incomingCall,
            action: "answer",
          })
        );
      }
    });

    socket.on("isVideoStopped", ({ isVideoStopped }) => {
      if (!isVideoStopped) {
        dispatch(
          setIncoming({
            ...incomingCall,
            action: "puse",
          })
        );
      } else {
        dispatch(
          setIncoming({
            ...incomingCall,
            action: "answer",
          })
        );
      }
    });

    socket.on("isMutedOut", ({ isMuted }) => {
      if (!isMuted) {
        dispatch(
          setOutgoingCall({
            ...outgoingCall,
            action: "mute",
          })
        );
      } else {
        dispatch(
          setOutgoingCall({
            ...outgoingCall,
            action: "normal",
          })
        );
      }
    });

    socket.on("isVideoStoppedOut", ({ isVideoStopped }) => {
      if (!isVideoStopped) {
        dispatch(
          setOutgoingCall({
            ...outgoingCall,
            action: "puse",
          })
        );
      } else {
        dispatch(
          setOutgoingCall({
            ...outgoingCall,
            action: "normal",
          })
        );
      }
    });

    return () => {
      socket.off("connect");
      socket.off("offer");
      socket.off("answer");
      socket.off("call_ended");
      socket.off("call_declined");
      socket.off("new_ice_candidate");
      socket.off("isMuted");
      socket.off("isVideoStopped");
      socket.off("isMutedOut");
      socket.off("isVideoStoppedOut");
      peerConnection.close();
    };
  }, [socket, userData, authenticated, dispatch, isCallId]);

  // Mute handling
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  // Video stop handling
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoStopped;
      });
    }
  }, [isVideoStopped, localStream]);

  return null;
};

export default RtcConnection;
