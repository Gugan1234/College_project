const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Survey = require('./models/Survey');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/survey_app');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const surveys = await Survey.find();
  res.render('index', { surveys });
});

app.get('/create', (req, res) => res.render('create'));

app.post('/create', async (req, res) => {
  const options = req.body.options.split(',').map(o=>o.trim());
  const responses = {};
  options.forEach(o=> responses[o]=0);
  await Survey.create({ question: req.body.question, options, responses });
  res.redirect('/');
});

app.get('/vote/:id', async (req, res) => {
  const s = await Survey.findById(req.params.id);
  res.render('vote', { survey: s });
});

app.post('/vote/:id', async (req, res) => {
  const s = await Survey.findById(req.params.id);
  const opt = req.body.option;
  s.responses.set(opt, (s.responses.get(opt) || 0) + 1);
  await s.save();
  res.redirect('/');
});

app.listen(5003, ()=> console.log('Survey App → http://localhost:5003'));
