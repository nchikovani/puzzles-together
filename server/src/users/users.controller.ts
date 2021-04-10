import UsersService from './users.service';
import {NextFunction, Request, Response} from 'express';
import jwt = require("jsonwebtoken");
import {ServerError, serverErrorMessages} from 'shared';
import config from "../config";

class UsersController {
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    jwt.verify(token, config.tokenKey,async (err: any, data: any)=>{
      if(!err){
        const userId = data.id;
        try {
          const user = await UsersService.getUserById(userId);
          if (user) {
            return res.status(200).json({id: user._id, registered: user.registered});
          } else {
            res.clearCookie('token');
            return next(new ServerError(404, serverErrorMessages.userNotFound));
          }
        } catch (error) {
          res.clearCookie('token');
          return next(error);
        }
      } else {
        const user = await UsersService.createUser();
        const newToken = jwt.sign({id: user._id}, config.tokenKey);
        res.cookie('token', newToken,{maxAge: config.tokenMaxAge, httpOnly:true});
        return res.status(200).json({id: user._id, registered: user.registered});
      }
    });
  }
}

export default new UsersController();