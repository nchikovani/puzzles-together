import express = require("express");
import UsersController from './rooms.controller';
import {asyncMiddleware} from "../middleware/asyncMiddleware";

const router = express.Router();
router.get("/:userId", asyncMiddleware(UsersController.getRooms));
router.post("/", asyncMiddleware(UsersController.addRoom));

export default router;