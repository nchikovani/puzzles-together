
import {NextFunction, Request, Response} from 'express';
import {ServerError, serverErrorMessages} from 'shared';
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ServerError) {
    return res.status(err.code).json({message: err.message});
  }
  if (err instanceof Error) {
    return res.status(500).json({message: err.message});
  }
  return res.status(500).json({message: serverErrorMessages.serverError});
};

export default errorHandler;