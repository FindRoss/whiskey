import express from 'express'; 
import pool from '../db.js'; 

const router = express.Router(); 

router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    const result = await pool.query('SELECT * FROM tastings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tasting not found' });
    }

    res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const { taster, tasted_on, comment, rating } = req.body;  

    if (!taster) {
        return res.status(400).json({ error: 'taster is required' }); 
    }

    const result = await pool.query(
        `UPDATE tastings
        SET taster = $1, tasted_on = COALESCE($2, tasted_on), comment = $3, rating = $4
        WHERE id = $5
        RETURNING *`,
        [taster, tasted_on, comment, rating, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tasting not found' });
    }

    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;  
    const result = await pool.query('DELETE FROM tastings WHERE id = $1 RETURNING *', [id]); 

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tasting no found' });
    }

    res.status(204).send(); 
});

export default router; 