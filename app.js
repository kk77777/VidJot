const express = require('express');

const app = express(); //Initalise the app

const port = 4000;

app.listen(port, () => {
  //Listen on port 5000
  console.log(`Server running on port ${port}`);
});
