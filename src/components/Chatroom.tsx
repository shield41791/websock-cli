import React, {useState, useRef, useEffect} from 'react';
import '../styles/Chatroom.css';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';
import { connect } from 'http2';


const Chatroom = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const sock = new SockJS("http://localhost:8080/ws");
  const stomp = StompJs.over(sock);
  console.log(`connected : ${stomp.connected}`);
  
  useEffect(() => {
    if (userId) {
      console.log(`Hello, ${userId}`);
      connect();
      return () => {
        disconnect();
      }
    }
  }, [userId])

  /**
   * Enter Chatroom
   * @param event 
   */
  const enter = (event: any)  => {
    var inputUserId = (document.getElementById("userId") as HTMLInputElement).value;
    if (inputUserId) {
      setUserId(inputUserId);
    } else {
      alert("input userId");
    }

    // don't refresh
     event.preventDefault();
  }

  /**
   * Connect & Subscribe
   */
  const connect = () => {
      // to hide console msg...
      // stomp.debug = null
      
      // connect & subscribe
      stomp.connect(
        {}, 
        () => {
          // success
          setIsConnected(true)

          // set timeout 
          stomp.heartbeat.incoming = 1000;
          stomp.heartbeat.outgoing = 1000; // client will send heartbeats every XXXms

          // subscribe
          stomp.subscribe(
            "/topic/public", 
            (data) => {
              const newMessage = JSON.parse(data.body);
              if (newMessage.type === 'JOIN') {
                setMessage(previousMessage => {return `${previousMessage}${newMessage.sender}님이 입장하셨습니다.\n`});
              } else if (newMessage.type === 'LEAVE') {
                setMessage(previousMessage => {return `${previousMessage}${newMessage.sender}님이 퇴장하셨습니다.\n`});
              } else if (newMessage.type === 'CHAT') {
                setMessage(previousMessage => {return `${previousMessage}${newMessage.sender} : ${newMessage.content}\n`});
              }
            }
          )
          // send join message
          stomp.send("/app/chat.addUser", {}, JSON.stringify({type: 'JOIN', sender: userId}));
        }, 
        () => {
          // error
          alert("연결에 실패했습니다.");
          setIsConnected(false);
          setUserId('');
      })
  }

  /**
   * Disconnect
   */
  const disconnect = () => {
    console.log(`Bye, ${userId}`);

    // to hide console msg...
    // stomp.debug = null

    stomp.disconnect(() => {
      stomp.unsubscribe("sub");
    }, {});

    setUserId('');
    setMessage('');
    setIsConnected(false);
  }

  /**
   * Send Message
   * @param event 
   */
  const sendMessage = (event: any) => {
    // to hide console msg...
    // stomp.debug = null

    var message = (document.getElementById("inputMessage") as HTMLInputElement).value;
    
    // send message
    const data = {
      type: "CHAT",
      content: message,
      sender: userId
    };
    stomp.send("/app/chat.sendMessage", {}, JSON.stringify(data));

    // clear textarea
    (document.getElementById("inputMessage") as HTMLInputElement).value = "";

    event.preventDefault();
  }

  return (
    <div>
      {!isConnected ? (
        <div>
          <form onSubmit={(event) => enter(event)}>
            <input type="text" id="userId"></input>
            <button>enter</button>
          </form>
        </div>
      ) : (
        <div className={`chatArea`}>
          <div>
            Your ID : {userId}
            <button className={`outButton`} onClick={() => disconnect()}>quit</button>
          </div>
          <div>
            <textarea 
              id={`chatlist`} 
              className={`outputTextArea`} 
              value={message}
              readOnly
            ></textarea>
          </div>
          <div className={`inputArea`}>
            <form onSubmit={(event) => sendMessage(event)}>
              <textarea 
                id={'inputMessage'}
                className={`inputTextArea`} 
              ></textarea>
              <button className={`sendButton`}>send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatroom;
