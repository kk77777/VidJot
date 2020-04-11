const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); //Initalise the app

//Connect to mongoose
const uri = process.env.ATLAS_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('connected to database');
  } catch (error) {
    console.error(error.message);
  }
};
connectDB();

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Body-Parser Middlewear
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlbars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');

//Home Page Route
app.get('/', (req, res) => {
  res.render('home');
});

//About Page Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Process Idea Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    res.send('Ok');
  }
});

const port = 4000;

app.listen(port, () => {
  //Listen on port
  console.log(`Server running on port ${port}`);
});

// process.on('SIGINT', () => {
//   console.log('Bye bye!');
//   process.exit();
// });
