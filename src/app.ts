import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';
import proxy from 'express-http-proxy';

dotenv.config();

// load env variables
const USER_HOST = process.env.USER_HOSTNAME || 'http://localhost:8080';
const AUTH_HOST = process.env.AUTH_HOSTNAME || 'http://localhost:8081';
const PORT = process.env.PORT || 8000;
// create express app
const app = express();
// middleware
app.use(cors());
// routes
app.use(indexRouter);
// microservice proxy routes
app.use('/user', proxy(USER_HOST));
app.use('/auth', proxy(AUTH_HOST));
// start server
app.listen(PORT, () => {
  console.log(`Gateway server listening on port ${PORT}...`);
});
