const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const initDatabase = require('../baza/baza');
const checkAuth = require('../middleware/auth');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function addMonsterTaste(req, res, next) {
  const query = 'insert into monsters(taste_name,taste,sugarfree) values (?,?,?)';
  const tasteName = req.body.tasteName;
  const taste = req.body.taste;
  const sugarFree = req.body.sugarFree ? 1 : 0;
  const db = initDatabase();
  if (![tasteName, taste, sugarFree].every((x) => !!x)) {
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  db.run(query, [tasteName, taste, sugarFree], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Couldn't create taste" });
    } else {
      res.status(201).json({ message: 'Created taste' });
    }
    db.close();
  });
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function removeMonsterTaste(req, res, next) {
  const query = 'delete from monsters where id=?';
  const id = req.params.tasteId;
  const db = initDatabase();
  if (!id) {
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  db.run(query, [id], (err) => {
    if (err) {
      res.status(500).json({ message: "Couldn't remove taste" });
    } else {
      res.status(200).json({ message: 'Removed taste' });
    }
    db.close();
  });
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function addMonsterTasteRating(req, res, next) {
  const query = 'insert into taste_rating(rating,taste_id,user) values(?,?,(select id from users where name=?))';
  const tasteId = req.params.tasteId;
  const username = req.body.username;
  const rating = req.body.rating;
  const db = initDatabase();
  if (![rating, tasteId, username].every((x) => !!x)) {
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  db.run(query, [rating, tasteId, username], (err) => {
    if (err) {
      res.status(500).json({ message: "Couldn't add rating" });
    } else {
      res.status(201).json({ message: 'Added rating' });
    }
    db.close();
  });
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function removeMonsterTasteRating(req, res, next) {
  const query = 'delete from taste_rating where taste_id=? and user=(select id from users where name=?)';
  const username = req.body.username;
  const tasteId = req.params.tasteId;
  const db = initDatabase();
  if (![username, tasteId].every((x) => !!x)) {
    res.status(401).json({ message: 'Bad arguments' });
    return;
  }
  db.run(query, [tasteId, username], (err) => {
    if (err) {
      res.status(500).json({ message: "Couldn't return rating" });
    } else {
      res.status(200).json({ message: 'Deleted' });
    }
    db.close();
  });
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function getMonsterTasteById(req, res, next) {
  const query = 'select * from monsters where id=?';
  const monsterId = req.params.tasteId;
  const db = initDatabase();
  if (!monsterId) {
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  db.get(query, [monsterId], (err, row) => {
    if (err) {
      res.status(500).json({ message: "Couldn't fetch rows" });
    } else {
      res.status(200).json({ taste: row });
    }
    db.close();
  });
}
function getMonsterTasteRatings(req, res, next) {
  const query = 'select m.taste_name, m.taste, m.sugarfree, t.rating,u.name from taste_rating t join monsters m on m.id=t.taste_id join users u on u.id=t.user where t.taste_id=?';
  const tasteId = req.params.tasteId;
  const db = initDatabase();
  if (!tasteId) {
    res.status(400).json({ message: 'Bad arguments' });
    return;
  }
  db.all(query, [tasteId], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Couldn't fetch rows" });
    } else {
      res.status(200).json({ ratings: rows });
    }
  });
}

router.post('/taste', checkAuth, addMonsterTaste);
router.delete('/taste/:tasteId', checkAuth, removeMonsterTaste);
router.post('/taste/:tasteId/rating', checkAuth, addMonsterTasteRating);
router.delete('/taste/:tasteId/rating', checkAuth, removeMonsterTasteRating);
router.get('/taste/:tasteId', getMonsterTasteById);
router.get('/taste/:tasteId/rating', getMonsterTasteRatings);

module.exports = router;
