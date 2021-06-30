/**
 *
 * @param {string} name database name
 * @returns {Database} database object
 */
function initDatabase(name = null) {
  sqlite3 = require('sqlite3');
  fs = require('fs');
  const dbCreates = {
    createMonsterTable: 'create table monsters (id integer primary key asc on conflict fail autoincrement, taste_name text, taste text, sugarfree integer)',
    createUsersTable: 'create table users (id integer primary key asc on conflict fail autoincrement, name text, hash text)',
    createTasteRatingTable:
      'create table taste_rating (id integer primary key asc on conflict fail autoincrement, rating real, taste_id integer references monsters(id) on delete no action on update cascade, user integer references users(id) on delete no action on update cascade)',
  };
  const dbFile = name || 'monster.sqlite';
  const dbExists = fs.existsSync(dbFile);
  const db = new sqlite3.Database(dbFile);
  if (!dbExists) {
    db.serialize(() => {
      db.run(dbCreates.createMonsterTable);
      db.run(dbCreates.createUsersTable);
      db.run(dbCreates.createTasteRatingTable);
    });
  }
  return db;
}
module.exports = initDatabase;
