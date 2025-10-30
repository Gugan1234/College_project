const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Project = require('./models/Project');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/project_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ROUTES

// Dashboard
app.get('/', async (req, res) => {
  const projects = await Project.find();
  res.render('index', { projects });
});

// Add Project Form
app.get('/projects/add', (req, res) => {
  res.render('add'); // Make sure add.ejs exists in views/
});

// Handle Add Project POST
app.post('/projects/add', async (req, res) => {
  const { name, description } = req.body;
  await Project.create({ name, description, status: 'In Progress' });
  res.redirect('/');
});

// Mark project complete
app.get('/projects/complete/:id', async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: 'Completed' });
  res.redirect('/');
});

// Start Server
app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
