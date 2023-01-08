import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { LoginUserInput } from '../schemas/Auth.schema';
import { signTokens } from '../services/jwt';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookies';
import { USER_HOST } from '../app';

export const indexHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Gateway server online!' });
};

export const loginHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log('  ---  POST /login');

  try {
    // get the user object from User service

    const responseFromUserService = await axios.post(`${USER_HOST}/login`, { email });
    const user = responseFromUserService.data;
    // check if passwords match
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid log credentials' });
    }
    // remove the password field from the user object
    delete user.password;
    // sign tokens and send to client
    console.log(`  ---  User ${user.email} has been authenticated  ---`);
    const { accessToken, refreshToken } = await signTokens({ user: user });
    res.cookie('sb-access-token', accessToken, accessTokenCookieOptions);
    res.cookie('sb-refresh-token', refreshToken, refreshTokenCookieOptions);
    res.status(200).json({ message: 'sucessfully authenticated', token: accessToken, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'an error occured' });
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  console.log(req.cookies);
  res.cookie('sb-access-token', { httpOnly: true }, { expires: new Date(0) });
  res.cookie('sb-refresh-token', { httpOnly: true }, { expires: new Date(0) });
  console.log('user is now being redirected to the login screen...supposedly');
  return res.status(200).json({ message: 'user has been successfully logged out' });
};
