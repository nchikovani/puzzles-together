import express = require("express");
import UsersController from './users.controller';
import {asyncMiddleware} from "../middleware/asyncMiddleware";

const router = express.Router();

router.get("/authenticate", asyncMiddleware(UsersController.getUserInfo));
// router.post("/login", UsersController.getUser);
// router.post("/register", UsersController.getUser);


export default router;