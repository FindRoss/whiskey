import express from 'express';
import bcrypt from 'bcrypt'; 
import pool from '../db.js'; 
import jwt from 'jsonwebtoken'; 

const router = express.Router(); 

router.post('/register', async (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' }); 
  }

  const passwordHash = await bcrypt.hash(password, 10); 

  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at', 
    [username, passwordHash]
  );  

  res.status(201).json(result.rows[0]); 
}); 

router.post('/login', async (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]); 

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const user = result.rows[0]; 
  const passwordMatches = await bcrypt.compare(password, user.password_hash); 

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  
  );

  res.json({ token, role: user.role, user_id: user.id });
});

export default router; 