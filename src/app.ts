import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import { moveTokenToHeader } from './middleware/parseAuthCookie';

dotenv.config();

// load env variables
export const USER_HOST = process.env.USER_HOST || 'http://localhost:8080';
export const AUTH_HOST = process.env.AUTH_HOST || 'http://localhost:8081';
export const BEAT_HOST = process.env.BEAT_HOST || 'http://localhost:8082';
export const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost:3000';
const PORT = process.env.PORT || 8000;
// create express app
const app = express();
// cors
app.use(cors({ credentials: true, origin: CLIENT_HOST }));
app.use(cookieParser());
// microservice proxy routes
app.use('/user', moveTokenToHeader, proxy(USER_HOST, { limit: '10mb' }));
app.use('/beats', moveTokenToHeader, proxy(BEAT_HOST, { limit: '100mb' }));
// middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
// routes
app.use(indexRouter);
// start server
app.listen(PORT, () => {
  console.log(`Gateway server listening on port ${PORT}...`);
});
