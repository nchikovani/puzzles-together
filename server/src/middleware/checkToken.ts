import jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';
import config from "../config";
import {serverErrorMessages} from 'shared';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  jwt.verify(token, config.tokenKey,(err: any, data: any)=>{
    if(err){
      return res.status(401 ).json({message: serverErrorMessages.invalidToken});
    } else if (data.id){
      req.userId = data.id;
      next();
    }
  });
}
