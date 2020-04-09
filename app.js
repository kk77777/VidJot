const express = require('express');

const app = express(); //Initalise the app

//Home Page Route
app.get('/', (req, res) => {
  res.send('Home');
});

//About Page Route
app.get('/about', (req, res) => {
  res.send('About');
});

const port = 4000;

app.listen(port, () => {
  //Listen on port 5000
  console.log(`Server running on port ${port}`);
});
