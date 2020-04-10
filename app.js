const express = require('express');
const exphbs = require('express-handlebars');
const app = express(); //Initalise the app

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

const port = 4000;

app.listen(port, () => {
  //Listen on port 5000
  console.log(`Server running on port ${port}`);
});
