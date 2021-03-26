const path = require("path");
const bodyParser = require('body-parser');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

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
      parts: partsTest
    };
    socket.broadcast.emit("puzzle", puzzles);
    socket.emit("puzzle", puzzles);
  });

  socket.on("puzzle:setUpdate", (data) => {
    const {moves, connections} = data.update;
    // if (moves || !Array.isArray(data.moves)) return;
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

const partsTest = [
  {
    id: '1',
    xIndex: 0,
    yIndex: 0,
    x: 621,
    y: 310,
    topLink: null,
    leftLink: null,
    rightLink: {
      type: 'concave',
      connected: false,
      id: '4',
    },
    bottomLink: {
      type: 'concave',
      connected: false,
      id: '2',
    }
  }, {
    id: '2',
    xIndex: 0,
    yIndex: 1,
    x: 200,
    y: 200,
    topLink: {
      type: 'convex',
      connected: false,
      id: '1',
    },
    leftLink: null,
    rightLink: {
      type: 'convex',
      connected: false,
      id: '5',
    },
    bottomLink: {
      type: 'convex',
      connected: false,
      id: '3',
    }
  }, {
    id: '3',
    xIndex: 0,
    yIndex: 2,
    x: 300,
    y: 300,
    topLink: {
      type: 'concave',
      connected: false,
      id: '2',
    },
    leftLink: null,
    rightLink: {
      type: 'convex',
      connected: false,
      id: '6',
    },
    bottomLink: null
  }, {
    id: '4',
    xIndex: 1,
    yIndex: 0,
    x: 700,
    y: 500,
    topLink: null,
    leftLink: {
      type: 'convex',
      connected: false,
      id: '1',
    },
    rightLink: {
      type: 'convex',
      connected: false,
      id: '7',
    },
    bottomLink: {
      type: 'convex',
      connected: false,
      id: '5',
    }
  }, {
    id: '5',
    xIndex: 1,
    yIndex: 1,
    x: 544,
    y: 287,
    topLink: {
      type: 'concave',
      connected: false,
      id: '4',
    },
    leftLink: {
      type: 'concave',
      connected: false,
      id: '2',
    },
    rightLink: {
      type: 'convex',
      connected: false,
      id: '8',
    },
    bottomLink: {
      type: 'concave',
      connected: false,
      id: '6',
    }
  }, {
    id: '6',
    xIndex: 1,
    yIndex: 2,
    x: 10,
    y: 5,
    topLink: {
      type: 'convex',
      connected: false,
      id: '5',
    },
    leftLink: {
      type: 'concave',
      connected: false,
      id: '3',
    },
    rightLink: {
      type: 'concave',
      connected: false,
      id: '9',
    },
    bottomLink: null
  },{
    id: '7',
    xIndex: 2,
    yIndex: 0,
    x: 50,
    y: 520,
    topLink: null,
    leftLink: {
      type: 'concave',
      connected: false,
      id: '4',
    },
    rightLink: null,
    bottomLink: {
      type: 'convex',
      connected: false,
      id: '8',
    },
  }, {
    id: '8',
    xIndex: 2,
    yIndex: 1,
    x: 482,
    y: 10,
    topLink: {
      type: 'concave',
      connected: false,
      id: '7',
    },
    leftLink: {
      type: 'concave',
      connected: false,
      id: '5',
    },
    rightLink: null,
    bottomLink: {
      type: 'convex',
      connected: false,
      id: '9',
    },
  }, {
    id: '9',
    xIndex: 2,
    yIndex: 2,
    x: 100,
    y: 398,
    topLink: {
      type: 'concave',
      connected: false,
      id: '8',
    },
    leftLink: {
      type: 'convex',
      connected: false,
      id: '6',
    },
    rightLink: null,
    bottomLink: null
  }];