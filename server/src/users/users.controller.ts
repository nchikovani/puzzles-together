import UsersService from './users.service';
import {NextFunction, Request, Response} from 'express';
import jwt = require("jsonwebtoken");
import Error from "../utils/Error";


class UsersController {
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    jwt.verify(token,"secret_key",async (err: any, data: any)=>{
      if(!err){
        const userId = data.id;
        try {
          const user = await UsersService.getUserById(userId);
          if (user) {
            return res.status(200).json({id: user._id, registered: user.registered});
          } else {
            res.cookie('token', '',{maxAge:900000, httpOnly:true});
            return next(new Error(404, 'User not found.'));
          }
        } catch (error) {
          res.cookie('token', '',{maxAge:900000, httpOnly:true});
          return next(error);
        }
      } else {
        try {
          const user = await UsersService.createUser();
          const newToken = jwt.sign({id: user._id},'secret_key');
          res.cookie('token', newToken,{maxAge:900000, httpOnly:true});
          return res.status(200).json({id: user._id, registered: user.registered});
        } catch (error){
          return next(error);
        }
      }
    });
  }
}

export default new UsersController();