import express from 'express'; 
import pool from '../db.js'; 
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router(); 

router.get('/:id', async (req, res) => {
  const { id } = req.params; 
  const result = await pool.query(
    `SELECT tastings.*, users.username AS taster
    FROM tastings
    JOIN users ON tastings.user_id = users.id
    WHERE tastings.id = $1`, 
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Tasting not found' });
  }

  res.json(result.rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params; 
  const { tasted_on, comment, rating } = req.body;  

  const result = await pool.query(
    `UPDATE tastings
    SET tasted_on = COALESCE($1, tasted_on), comment = $2, rating = $3
    WHERE id = $4
    RETURNING *`,
    [tasted_on, comment, rating, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Tasting not found' });
  }

  res.json(result.rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;  
  const { id: currentUserId } = req.user;
  const { role } = req.user;
  const tasting = await pool.query('SELECT * FROM tastings where id = $1', [id]);

  if (tasting.rows.length === 0) {
    return res.status(404).json({ error: 'Tasting no found' });
  }
  
  const tastingUserId = tasting.rows[0].user_id;

  const isOwner = tastingUserId === currentUserId; 
  const isAdmin = role === 'admin'; 

  if (!isOwner && !isAdmin) {
    return res.status(404).json({ error: 'Only a tasting by the taster or Admin maybe delete a tasting.' });
  }

  const result = await pool.query('DELETE FROM tastings WHERE id = $1 RETURNING *', [id]); 
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Tasting no found' });
  }
  
  res.status(204).send(); 
});

export default router; 