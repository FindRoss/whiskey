import express from 'express'; 
import dotenv from 'dotenv'; 
import pool from './db.js';
import whiskiesRouter from './routes/whiskies.js'; 
import tastingsRouter from './routes/tastings.js';

dotenv.config(); 

const app = express(); 
app.use(express.json());
app.use('/whiskies', whiskiesRouter); 
app.use('/tastings', tastingsRouter);
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