const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Leave = require('./models/Leave');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/leave_management');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const leaves = await Leave.find().sort({ startDate: -1 });
  res.render('index', { leaves });
});

app.get('/apply', (req, res) => res.render('apply'));
app.post('/apply', async (req, res) => {
  await Leave.create(req.body);
  res.redirect('/');
});

app.get('/approve/:id', async (req, res) => {
  await Leave.findByIdAndUpdate(req.params.id, { status: 'Approved' });
  res.redirect('/');
});
app.get('/reject/:id', async (req, res) => {
  await Leave.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
  res.redirect('/');
});

app.listen(5001, () => console.log('Leave Management → http://localhost:5001'));
