const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
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
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set('view engine', 'handlebars');

//Home Page Route
app.get('/', (req, res) => {
  const title = 'Home';
  res.render('index', {
    title: title,
  });
});

//About Page Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Get Idea data from database
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas: ideas,
      });
    });
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
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Idea(newUser).save().then((idea) => {
      res.redirect('/ideas');
    });
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
