import express from 'express';
import bcrypt from 'bcrypt'; 
import pool from '../db.js'; 

const router = express.Router(); 

router.post('/register', async (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' }); 
  }

}); 