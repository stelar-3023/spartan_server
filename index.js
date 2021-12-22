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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers'
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
// app.use('/', require('./routes/exercise'));
app.get('https://spartan-db.herokuapp.com/exercises/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const exercises = await pool.query(
      `SELECT * FROM exercises where user_email='${email}'`
    );
    res.json(exercises.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
