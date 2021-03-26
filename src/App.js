import React, {useState, useEffect, useRef} from 'react';
import Game from './components/Game';
import {io} from "socket.io-client";

const SERVER_URL = 'http://localhost:8080';

function App() {
  const [puzzles, setPuzzles] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {

    socketRef.current = io(SERVER_URL, {transports: ['websocket', 'polling', 'flashsocket']});
    socketRef.current.on('puzzle', (puzzles) => {
      setPuzzles(puzzles);
    });
  }, []);

  const sendUpdate = (update) => {
    socketRef.current.emit('puzzle:setUpdate', { update })
  }

  const handleGettingUpdate = (handler) => {
    socketRef.current.on('puzzle:update', (data) => {
      handler(data.update);
    });
  }

  const handleImage = (e)=> {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      socketRef.current.emit('puzzle:add', { image: e.target.result })
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="App" style={{width: '100%'}}>
      <input type="file" onChange={handleImage} style={{display: 'block'}}/>
      <Game puzzles={puzzles} sendUpdate={sendUpdate} handleGettingUpdate={handleGettingUpdate}/>
    </div>
  );
}

export default App;
