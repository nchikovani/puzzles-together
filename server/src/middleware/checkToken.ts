import jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';
import config from "../config";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  jwt.verify(token, config.tokenKey,(err: any, data: any)=>{
    if(err){
      return res.status(401 ).send({message: 'Missing token.'});
    } else if (data.id){
      // @ts-ignore
      req.userId = data.id;
      next();
    }
  });
}
