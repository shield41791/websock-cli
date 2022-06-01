import React, {useState} from 'react';
import './App.css';

function App() {
  const [tempUserId, setTempUserId] = useState(null);
  const [userId, setUserId] = useState(null);

  // for test, skip id setting
  // const [userId, setUserId] = useState("shield41791");

  function changeTempUserId(event: any) {
    console.log(event.target.value)
    setTempUserId(event.target.value)
  }

  function startChat() {
    if (tempUserId) {
      setUserId(tempUserId)
    }
    alert(`Hello, ${tempUserId}`)
  }

  function sendMessage(event: any) {
    alert("hi")
  }

  return (
    <div>
      {!userId ? (
        <div>
          <input 
            type="text"
            onChange={(event) => changeTempUserId(event)}
            ></input>
          <button onClick={startChat}>start</button>
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
            <textarea
              className={`inputTextArea`}
            ></textarea>
            <button 
              className={`sendButton`}
              onClick={sendMessage}  
            >send</button>
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
