import { Message } from '@dvp/api-interfaces';
import express from 'express';

export const router = express.Router();
const greeting: Message = { message: 'Welcome to api!' };

router.get('/', (req, res) => {
  res.send(greeting);
});

// Add the routes here
