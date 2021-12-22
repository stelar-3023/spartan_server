const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const cors = require('cors');

// process.env.PORT
// process.env.NODE_ENV => production or development

// middleware
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT'
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  next();
});
app.use(express.json()); // req.body

app.get('/', function (req, res) {
  //when we get an http get request to the root/homepage
  res.send('Hello World');
});

// registration
app.use('/', require('./routes/registration'));

// login and verify
app.use('/', require('./routes/login'));

// exercise
app.use('/', require('./routes/exercise'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
