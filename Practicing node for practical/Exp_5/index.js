const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));

// Multer setup for food image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fooddelivery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', foodSchema);
const Order = require('./models/order');

// Home page: show all food items (menu)
app.get('/', async (req, res) => {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.render('home', { foods, orderSuccess: false });
});

// Add new food item
app.post('/add', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    let image = '';
    if (req.file) {
        image = '/uploads/' + req.file.filename;
    }
    if (name && description && price) {
        await Food.create({ name, description, price, image });
    }
    res.redirect('/');
});

// Delete food item
app.post('/delete/:id', async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Order food (show order form)
app.get('/order/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.render('order', { food });
});

// Handle order submission
app.post('/order/:id', async (req, res) => {
    const { customerName, address, quantity } = req.body;
    const foodId = req.params.id;
    if (customerName && address && quantity) {
        await Order.create({ foodId, customerName, address, quantity });
        const foods = await Food.find().sort({ createdAt: -1 });
        return res.render('home', { foods, orderSuccess: true });
    }
    res.redirect('/');
});

const port = 4000;
app.listen(port, () => {
    console.log(`Food Delivery app running on http://localhost:${port}`);
});
