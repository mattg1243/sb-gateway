import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(indexRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
