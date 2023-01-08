import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../services/jwt';

export const moveTokenToHeader = (req: Request, res: Response, next: NextFunction) => {
  console.log('cookies: ', req.cookies);
  const token = req.cookies['sb-access-token'];
  console.log('token: ', token);
  if (!token) {
    console.log(`Unauthorized request made to ${req.url}`);
    return res.status(401).json({ message: 'No access token detected in the request.' });
  }

  req.headers.authorization = token;
  next();
};
