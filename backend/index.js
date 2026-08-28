import express from 'express'; 
import dotenv from 'dotenv'; 
import pool from './db.js';
import cors from 'cors';
import whiskiesRouter from './routes/whiskies.js'; 
import tastingsRouter from './routes/tastings.js';
import uploadRouter from './routes/upload.js'; 
import authRouter from './routes/auth.js'; 


dotenv.config(); 

const app = express(); 
app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({ origin: allowedOrigins }));
app.use('/whiskies', whiskiesRouter); 
app.use('/tastings', tastingsRouter);
app.use('/upload', uploadRouter); 
app.use('/auth', authRouter); 
const port = process.env.PORT || 3001; 


app.get('/', (req, res) => {
  res.send('Whiskey Tracker API is running'); 
}); 

app.get('/db-test', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});