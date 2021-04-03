import jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  jwt.verify(token,"secret_key",(err: any, data: any)=>{
    if(err){
      return res.status(401 ).send({message: 'Missing token.'});
    } else if(data.id){
      req.userId = data.id;
      next();
    }
  });
}