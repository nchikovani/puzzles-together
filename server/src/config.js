const path = require("path");
const config = {
  port: process.env.PORT || 8080,
  mongoDbUri: 'mongodb+srv://admin:admin@cluster0.vr7at.mongodb.net/puzzles-together?retryWrites=true&w=majority',
  staticPath: path.join(__dirname, '../../client/build'),
  tokenKey: 'secret_key',
  tokenMaxAge: 2 * 24 * 60 * 60 * 1000,//days

}

export default config;