import React, {useState} from 'react';
import './App.css';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';

function App() {
  const [userId, setUserId] = useState('');

  // for test, skip id setting
  // const [userId, setUserId] = useState("shield41791");

  // enter chatroom
  const connect = (event: any)  => {
    var inputUserId = (document.getElementById("userId") as HTMLInputElement).value
    if (inputUserId) {
      setUserId(inputUserId)
      alert(`Hello, ${inputUserId}`)

      // connect
      const sock = new SockJS("http://localhost:8080/ws")
      const stomp = StompJs.over(sock)

    }

    // don't refresh
     event?.preventDefault()
  }

  // send message
  function sendMessage(event: any) {
    var message = (document.getElementById("message") as HTMLInputElement).value
    
    // TODO send message
    console.log(`${userId} : ${message}`);


    // clear textarea
    (document.getElementById("message") as HTMLInputElement).value = ""

    event.preventDefault();
  }

  return (
    <div>
      {!userId ? (
        <div>
          <form onSubmit={(event) => connect(event)}>
            <input 
              type="text"
              id="userId"
              // onChange={(event) => changeTempUserId(event)}
              ></input>
            <button 
              // onClick={startChat}
            >start</button>
          </form>
        </div>
      ) : (
        <div className={`chatArea`}>
          <div>Your ID : {userId}</div>
          <div>
            <textarea 
              className={`outputTextArea`}
              readOnly
            ></textarea>
          </div>
          <div className={`inputArea`}>
            <form onSubmit={(event) => sendMessage(event)}>
              <textarea
                className={`inputTextArea`}
                id="message"
              ></textarea>
              <button 
                className={`sendButton`} 
              >send</button>
            </form>
          </div>
        </div>
      )}
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
