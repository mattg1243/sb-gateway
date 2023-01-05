import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';

dotenv.config();

// load env variables
const USER_HOST = process.env.USER_HOSTNAME || 'http://localhost:8080';
const AUTH_HOST = process.env.AUTH_HOSTNAME || 'http://localhost:8081';
const BEAT_HOST = process.env.BEAT_HOSTNAME || 'http://localhost:8082';
const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost:3000';
const PORT = process.env.PORT || 8000;
// create express app
const app = express();
// cors
app.use(cors({ credentials: true, origin: CLIENT_HOST }));
// routes
app.use(indexRouter);
// microservice proxy routes
app.use('/user', proxy(USER_HOST, { limit: '10mb' }));
app.use('/auth', proxy(AUTH_HOST));
app.use('/beats', proxy(BEAT_HOST, { limit: '100mb' }));
// middleware
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
// start server
app.listen(PORT, () => {
  console.log(`Gateway server listening on port ${PORT}...`);
});
