import express = require("express");
import UsersController from './rooms.controller';

const router = express.Router();
router.get("/:userId", UsersController.getRooms);
router.post("/", UsersController.addRoom);

export default router;