import express = require("express");
import UsersController from './rooms.controller';
import {checkToken} from '../middleware/checkToken';

const router = express.Router();
router.use(checkToken);
router.get("/:userId", UsersController.getRooms);
router.post("/", UsersController.addRoom);


export default router;