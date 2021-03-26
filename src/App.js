import React from 'react';
import Game from './components/Game';
import SocketService from "./service/socketService";
import ErrorService from "./service/errorService";

function App() {
  const socketService = new SocketService();
  const errorService = new ErrorService();

  const handleImage = (e)=> {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      socketService.createPuzzle(e.target.result);
    });

    try {
      reader.readAsDataURL(file);
    } catch (e) {
      throw e;
    }

  }

  return (
    <div className="App" style={{width: '100%'}}>
      <input type="file" onChange={handleImage} style={{display: 'block'}}/>
      <Game socketService={socketService}/>
    </div>
  );
}

export default App;
