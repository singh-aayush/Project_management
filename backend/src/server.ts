// src/server.ts
import app from './app.js';
// import { config } from './config/index';
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
