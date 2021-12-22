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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});
app.use(express.json()); // req.body

if(process.env.NODE_ENV === 'production') {
  // serve static files
  app.use(express.static('client/build'));
}

app.get("/", function (req, res) {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});


// registration
app.use('/', require('./routes/registration'));

// login and verify
// app.use('/', require('./routes/login'));
router.post('https://spartan-db.herokuapp.com/login', validInfo, async (req, res) => {
  try {
    // 1. destructure the req.body
    const { email, password } = req.body;

    // check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or email is incorrect');
    }

    // 3. check if incoming password is the same as the database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    console.log(validPassword);

    if (!validPassword) {
      return res.status(401).json('Password or email is incorrect');
    }

    // 4. give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

// exercise
app.use('/', require('./routes/exercise'));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html' )); 
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
