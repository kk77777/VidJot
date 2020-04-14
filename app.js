const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
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

//Body-Parser Middleware
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

//Method-Override Middleware
app.use(methodOverride('_method'));

//Express-Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Home Page Route
app.get('/', (req, res) => {
  const title = 'Home';
  res.render('home', {
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

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    res.render('ideas/edit', {
      idea: idea,
    });
  });
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
      req.flash('success_msg', 'Video idea added');
      res.redirect('/ideas');
    });
  }
});

//Edit Form Process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then((idea) => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    });
  });
});

//Delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({
    _id: req.params.id,
  }).then(() => {
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  });
});

//User Login Route
app.get('/users/login', (req, res) => {
  res.send('login');
});

//User Register Route
app.get('/users/register', (req, res) => {
  res.send('register');
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
