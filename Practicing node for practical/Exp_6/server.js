// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const Product = require('./models/Product');

const app = express();

// ===== MongoDB (local) =====
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/used_products';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('Mongo error', err));

// ===== view engine & static files =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== multer config (store uploaded files in public/uploads) =====
const uploadDir = path.join(__dirname, 'public', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// ===== Routes =====

// Home - list products
app.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('index', { products });
});

// Sell form
app.get('/add', (req, res) => {
  res.render('add');
});

// Create product (sell)
app.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.png';
    await Product.create({ name, price: Number(price), description, image: imagePath });
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

// Buy product (mark sold)
app.get('/buy/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { sold: true });
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

// Edit page
app.get('/edit/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/');
  res.render('edit', { product });
});

// Update product (with optional new image)
app.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description
    };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    await Product.findByIdAndUpdate(req.params.id, updates);
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

// Delete product
app.get('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
