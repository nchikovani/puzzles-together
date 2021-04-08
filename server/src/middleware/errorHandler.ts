
import {NextFunction, Request, Response} from 'express';
import {ServerError} from 'shared';
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ServerError) {
    return res.status(err.code).json(err.message);
  }
  if (err instanceof Error) {
    return res.status(500).json(err.message);
  }
  return res.sendStatus(500);
};

export default errorHandler;