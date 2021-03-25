const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json({limit: '10mb', extended: true}));

app.listen(process.env.PORT || 8080, function(){
  console.log("Сервер ожидает подключения...");
});

app.post('/createPuzzle', function(req, res){
  const {img} = req.body;
  return res.json({img: img});
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

