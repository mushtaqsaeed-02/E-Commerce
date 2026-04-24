const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('API Running........');
});

app.get('/roles', async (req, res) => {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
});

app.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
});

app.post('/users', async (req, res) => {
    const { full_name, email, password, phone, role_id } = req.body;
    const result = await pool.query(
        'INSERT INTO users(full_name,email,password,phone,role_id) VALUES($1,$2,$3,$4,$5) RETURNING *',
        [full_name, email, password, phone, role_id]
    );
    res.json(result.rows[0]);
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, email, password, phone, role_id } = req.body;
    const result = await pool.query(
        'UPDATE users SET full_name=$1,email=$2,password=$3,phone=$4,role_id=$5 WHERE id=$6 RETURNING *',
        [full_name, email, password, phone, role_id, id]
    );
    res.json(result.rows[0]);
});

app.delete('/users/:id', async (req, res) => {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'Deleted' });
});

app.get('/vendors', async (req, res) => {
    const result = await pool.query('SELECT * FROM vendors ORDER BY id');
    res.json(result.rows);
});

app.post('/vendors', async (req, res) => {
    const { vendor_name, contact_email, phone } = req.body;
    const result = await pool.query(
        'INSERT INTO vendors(vendor_name,contact_email,phone) VALUES($1,$2,$3) RETURNING *',
        [vendor_name, contact_email, phone]
    );
    res.json(result.rows[0]);
});

app.put('/vendors/:id', async (req, res) => {
    const { id } = req.params;
    const { vendor_name, contact_email, phone } = req.body;
    const result = await pool.query(
        'UPDATE vendors SET vendor_name=$1,contact_email=$2,phone=$3 WHERE id=$4 RETURNING *',
        [vendor_name, contact_email, phone, id]
    );
    res.json(result.rows[0]);
});

app.delete('/vendors/:id', async (req, res) => {
    await pool.query('DELETE FROM vendors WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
});

app.get('/categories', async (req, res) => {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
});

app.post('/categories', async (req, res) => {
    const result = await pool.query(
        'INSERT INTO categories(category_name) VALUES($1) RETURNING *',
        [req.body.category_name]
    );
    res.json(result.rows[0]);
});

app.put('/categories/:id', async (req, res) => {
    const result = await pool.query(
        'UPDATE categories SET category_name=$1 WHERE id=$2 RETURNING *',
        [req.body.category_name, req.params.id]
    );
    res.json(result.rows[0]);
});

app.delete('/categories/:id', async (req, res) => {
    await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
});

app.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
});

app.post('/products', async (req, res) => {
    const { product_name, description, price, stock, category_id, vendor_id } = req.body;
    const result = await pool.query(
        'INSERT INTO products(product_name,description,price,stock,category_id,vendor_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
        [product_name, description, price, stock, category_id, vendor_id]
    );
    res.json(result.rows[0]);
});

app.put('/products/:id', async (req, res) => {
    const { product_name, description, price, stock, category_id, vendor_id } = req.body;
    const result = await pool.query(
        'UPDATE products SET product_name=$1,description=$2,price=$3,stock=$4,category_id=$5,vendor_id=$6 WHERE id=$7 RETURNING *',
        [product_name, description, price, stock, category_id, vendor_id, req.params.id]
    );
    res.json(result.rows[0]);
});

app.delete('/products/:id', async (req, res) => {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
});

app.get('/reviews', async (req, res) => {
    const result = await pool.query('SELECT * FROM reviews ORDER BY id');
    res.json(result.rows);
});

app.post('/reviews', async (req, res) => {
    const { user_id, product_id, rating, comment } = req.body;
    const result = await pool.query(
        'INSERT INTO reviews(user_id,product_id,rating,comment) VALUES($1,$2,$3,$4) RETURNING *',
        [user_id, product_id, rating, comment]
    );
    res.json(result.rows[0]);
});

app.put('/reviews/:id', async (req, res) => {
    const { user_id, product_id, rating, comment } = req.body;
    const result = await pool.query(
        'UPDATE reviews SET user_id=$1,product_id=$2,rating=$3,comment=$4 WHERE id=$5 RETURNING *',
        [user_id, product_id, rating, comment, req.params.id]
    );
    res.json(result.rows[0]);
});

app.delete('/reviews/:id', async (req, res) => {
    await pool.query('DELETE FROM reviews WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
});

app.get('/addresses', async (req, res) => {
    const result = await pool.query('SELECT * FROM addresses ORDER BY id');
    res.json(result.rows);
});

app.get('/cart', async (req, res) => {
    const result = await pool.query('SELECT * FROM cart ORDER BY id');
    res.json(result.rows);
});

app.get('/cart-items', async (req, res) => {
    const result = await pool.query('SELECT * FROM cart_items ORDER BY id');
    res.json(result.rows);
});

app.get('/orders', async (req, res) => {
    const result = await pool.query('SELECT * FROM orders ORDER BY id');
    res.json(result.rows);
});

app.get('/order-items', async (req, res) => {
    const result = await pool.query('SELECT * FROM order_items ORDER BY id');
    res.json(result.rows);
});

app.get('/payments', async (req, res) => {
    const result = await pool.query('SELECT * FROM payments ORDER BY id');
    res.json(result.rows);
});

app.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});