import express from 'express'; 
import pool from '../db.js'; 

const router = express.Router(); 

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM whiskies ORDER BY id'); 
    res.json(result.rows); 
});

router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    const result = await pool.query('SELECT * FROM whiskies WHERE id = $1', [id]); 

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Whiskey not found' });
    } 

    res.json(result.rows[0]);
 });

 router.post('/', async (req, res) => {
    const {name, distillery, region, type, age_years, abv, notes} = req.body; 

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const result = await pool.query(
        `INSERT INTO whiskies (name, distillery, region, type, age_years, abv, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`, 
        [name, distillery, region, type, age_years, abv, notes]
    );

    res.status(201).json(result.rows[0]);
 });    

 router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const { name, distillery, region, type, age_years, abv, notes } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' }); 
    }

    const result = await pool.query(
        `UPDATE whiskies
        SET name = $1, distillery = $2, region = $3, type = $4, age_years = $5, abv = $6, notes = $7
        WHERE id = $8
        RETURNING *`,
        [name, distillery, region, type, age_years, abv, notes, id]
    ); 

    if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Whiskey not found' });
    }

    res.json(result.rows[0]);
 });

 router.delete('/:id', async (req, res) => {
    const { id } = req.params; 

    const result = await pool.query('DELETE FROM whiskies WHERE id = $1 RETURNING *', [id]); 

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Whiskey not found' });
    }

    res.status(204).send();
 });

 router.get('/:id/tastings', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        'SELECT * FROM tastings WHERE whiskey_id = $1 ORDER BY tasted_on DESC',
        [id]
    );
    res.json(result.rows);
 });

 router.post('/:id/tastings', async (req, res) => {
    const { id } = req.params; 
    const { taster, tasted_on, comment, rating } = req.body; 

    if (!taster) {
        return res.status(400).json({ error: 'taster is required' });
    }

    const result = await pool.query(
        `INSERT INTO tastings (whiskey_id, taster, tasted_on, comment, rating)
        VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5)
        RETURNING *`,
        [id, taster, tasted_on, comment, rating]
    );

    res.status(201).json(result.rows[0]);
 });

 router.get('/:id/rating', async (req, res) => {
    const { id } = req.params; 

    const result = await pool.query(
        `SELECT
            w.id,
            w.name,
            ROUND(AVG(t.rating), 1) AS average_rating,
            COUNT(t.id) AS tasting_count
        FROM whiskies w
        LEFT JOIN tastings t On t.whiskey_id = w.id
        WHERE w.id = $1
        GROUP BY w.id`, 
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Whiskey not found' }); 
    }

    res.json(result.rows[0]); 
 });



 export default router;