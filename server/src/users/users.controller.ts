import UsersService from './users.service';
import { Request, Response } from 'express';
import jwt = require("jsonwebtoken");


class UsersController {
  async getUserInfo(req: Request, res: Response) {
    const token = req.cookies.token;

    jwt.verify(token,"secret_key",async (err: any, data: any)=>{
      if(!err){
        const userId = data.id
        const user = await UsersService.getUserById(userId);

        if (user !== undefined) {
          if (user) {
            res.status(200).json({id: user._id, registered: user.registered});
          } else {
            res.status(404).send({ message: 'User not found.' });
          }
        } else {
          res.status(500).send({ message: 'Unable find user.' });
        }
      } else {
        const user = await UsersService.createUser();
        if (user) {
          const newToken = jwt.sign({id: user._id},'secret_key');
          res.cookie('token', newToken,{maxAge:900000, httpOnly:true});
          res.status(200).json({id: user._id, registered: user.registered});
        } else {
          res.status(500).send({ message: 'Unable create user.' });
        }
      }
    });
  }
}

export default new UsersController();