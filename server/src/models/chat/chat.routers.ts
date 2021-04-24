import express = require("express");
import UsersController from './chat.controller';
import {asyncMiddleware} from "../../middleware/asyncMiddleware";

const router = express.Router();

router.get("/", asyncMiddleware(UsersController.getChat));
export default router;