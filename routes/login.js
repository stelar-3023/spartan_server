const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');
const jwtGenerator = require('../utils/jwtGenerator');

// login route
router.post('/login', validInfo, async (req, res) => {
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

// verify route
router.post('/verify', authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server error');
  }
});

router.post('/profile', authorization, async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      req.user.id,
    ]);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
