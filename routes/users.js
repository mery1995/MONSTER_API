const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const initDatabase = require('../baza/baza');

//#region userRoutes
/**
 * Creates new user
 * @param {Request} req request object
 * @param {Response} res response object
 * @param {NextFunction} next next function
 *
 */
function signup(req, res, next) {
  const query = 'insert into users (name, hash) values(?,?)';
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    console.log('./signup 400');
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  void bcrypt.hash(password, 10).then((hash) => {
    const db = initDatabase();
    db.run(query, [username, hash], (err) => {
      if (err) {
        console.log(`./signup 500: ${err}`);
        res.status(500).json({ message: "Couldn't create user" });
      } else {
        console.log('./signup 201');
        res.status(201).json({ message: 'User created' });
      }
      db.close();
    });
  });
}

/**
 * Logins user to session, returns jwt token in response object
 * @param {Request} req request object
 * @param {Response} res response object
 * @param {NextFunction} next next function
 */
function login(req, res, next) {
  const query = 'select hash from users where name=?';
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    console.log('./login 400');
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  const db = initDatabase();
  db.get(query, [username], (err, row) => {
    if (err) {
      res.status(404).json({ message: 'User not found' });
    } else {
      bcrypt.compare(password, row.hash).then((val) => {
        if (!val) {
          res.status(401).json({ message: 'Bad password' });
          return;
        }
        const token = jwt.sign({ username: username }, process.env.SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: 'Logged in', token: token });
        db.close();
      });
    }
  });
}

router.post('/signup', signup);
router.post('/login', login);
module.exports = router;
