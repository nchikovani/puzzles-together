import express = require("express");
import UsersController from './users.controller';

const router = express.Router();

router.get("/authenticate", UsersController.getUserInfo);
// router.post("/login", UsersController.getUser);
// router.post("/register", UsersController.getUser);


export default router;