const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Post = require('./models/Post');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/blog_app');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render('index', { posts });
});

app.get('/new', (req, res) => res.render('new'));
app.post('/new', async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
});

app.get('/view/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('view', { post });
});

app.listen(5004, ()=> console.log('Blog App → http://localhost:5004'));
