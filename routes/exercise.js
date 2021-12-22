const express = require('express');
const router = express.Router();
const pool = require('../db');

// add exercise
router.post('/exercises/:email', async (req, res) => {
  try {
    const { exercise, reps, weight, date, email } = req.body;
    const newExercise = await pool.query(
      `INSERT INTO exercises (exercise, reps, weight, date_performed, user_email) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [exercise, reps, weight, date, email]
    );

    res.json(newExercise.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all exercises
router.get('/exercises/:email', async (req, res) => {
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

// get exercise by id
router.get('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await pool.query(
      'SELECT * FROM exercises WHERE exercise_id = $1',
      [id]
    );
    res.json(exercise.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// update exercise
router.put('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise, reps, weight } = req.body;
    console.log(req.body);

    const updateExercise = await pool.query(
      'UPDATE exercises SET exercise = $1, reps = $2, weight = $3 WHERE exercise_id = $4',
      [exercise, reps, weight, id],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        } else {
          res.status(200).send(req.body);
        }
      }
    );
    // res.json('Exercise updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete exercise
router.delete('https://spartan-db.herokuapp.com/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteExercise = await pool.query(
      'DELETE FROM exercises WHERE exercise_id = $1',
      [id]
    );
    res.json('Exercise deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
