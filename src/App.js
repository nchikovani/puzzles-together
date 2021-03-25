import React, {useState} from 'react';
import Game from './components/Game';

function App() {
  const [img, setImg] = useState(null);
  const handleImage = (e)=> {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      fetch('/createPuzzle',{
        method: "POST",
        body:  JSON.stringify({
          img: e.target.result,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => {
        res.json().then(body=> {
          setImg(body.img);
        });

      });
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="App" style={{width: '100%'}}>
      <input type="file" onChange={handleImage} style={{display: 'block'}}/>
      <Game img={img}/>
    </div>
  );
}

export default App;
