const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json({limit: '10mb', extended: true}));

const server = http.createServer(app);

const io = socketIo(server);

// app.post('/createPuzzle', function(req, res){
//   puzzles.image = req.body.img;
//
//   return res.json({img: puzzles.image, puzzles});
// });

// app.get('/puzzle', function(req, res){
//
//   return res.json({img, puzzles});
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  // const { roomId } = socket.handshake.query
  // // сохраняем название комнаты в соответствующем свойстве сокета
  // socket.roomId = roomId
  //
  // // присоединяемся к комнате (входим в нее)
  // socket.join(roomId)
  puzzles && socket.emit("puzzle", puzzles);

  socket.on("puzzle:add", (data) => {
    puzzles = {
      image: data.image,
      partWidth: 50,
      partHeight: 50,
      parts: createParts(20, 20),
    };
    socket.broadcast.emit("puzzle", puzzles);
    socket.emit("puzzle", puzzles);
  });

  socket.on("puzzle:setUpdate", (data) => {
    const {moves, connections} = data.update;
    // if (moves || !Array.isArray(data.moves)) return;
    if (!puzzles) return;
    puzzles.parts.forEach((part) => {
      const move = moves.find((move) => move.id === part.id);
      if (move) {
        part.x = move.x;
        part.y = move.y;
      }
    });

    const connect = (connection) => {
      const part = puzzles.parts.find((part) => part.id === connection.id);
      const link = part && part[connection.link];
      if (link) link.connected = true;
    };
    connections.forEach((connection) => {
      connect(connection[0]);
      connect(connection[1]);
    });

    socket.broadcast.emit("puzzle:update", data);
  });

  // handle the event sent with socket.emit()
  // socket.on("salutations", (elem1, elem2, elem3) => {
  //   console.log(elem1, elem2, elem3);
  // });
});

server.listen(port, function(){
  console.log("Сервер ожидает подключения...");
});

let puzzles = null;

function createParts(columnCount, rowCount) {
  const parts = [];
  const getRandomLinkType = () => {
    return Math.random() > 0.5 ? 'concave': 'convex';
  }

  for (let i = 0; i < columnCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      let topLink, rightLink, leftLink, bottomLink;
      const id = uuidv4();
      if (j === 0) {
        topLink = null;
      } else {
        const connectingPart = parts.find((part) => part.xIndex === i && part.yIndex === j - 1);
        connectingPart.bottomLink.id = id;
        topLink = {
          connected: false,
          type: connectingPart.bottomLink.type === 'concave' ? 'convex' : 'concave',
          id: connectingPart.id,
        }
      }
      if (i === 0) {
        leftLink = null;
      } else {
        const connectingPart = parts.find((part) => part.xIndex === i-1 && part.yIndex === j);
        connectingPart.rightLink.id = id;
        leftLink = {
          connected: false,
          type: connectingPart.rightLink.type === 'concave' ? 'convex' : 'concave',
          id: connectingPart.id,
        }
      }
      if (i === columnCount - 1) {
        rightLink = null;
      } else {
        rightLink = {
          type: getRandomLinkType(),
          connected: false,
        }
      }
      if (j === rowCount - 1) {
        bottomLink = null;
      } else {
        bottomLink = {
          type: getRandomLinkType(),
          connected: false,
        }
      }

      parts.push({
        id,
        xIndex: i,
        yIndex: j,
        x: Math.random() * 800,
        y: Math.random() * 600,
        topLink,
        leftLink,
        rightLink,
        bottomLink
      })
    }
  }

  return parts;
}