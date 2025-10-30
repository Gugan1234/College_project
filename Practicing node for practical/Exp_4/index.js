const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/microblog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Home page: show all posts
app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('home', { posts });
});


// Add new post
app.post('/add', async (req, res) => {
    const { author, content } = req.body;
    if (author && content) {
        await Post.create({ author, content });
    }
    res.redirect('/');
});

// Delete post
app.post('/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Microblog app running on http://localhost:${port}`);
});
