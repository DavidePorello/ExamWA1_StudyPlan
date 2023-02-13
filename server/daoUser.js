'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('courses.db', err => { if (err) throw err; });

// get user by credentials
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(false);
      else {
        const user = { id: row.id, username: row.username, name: row.name };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPasswd) {
          if (err) reject(err);
          if (crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPasswd)) {
            resolve(user);
          }
          else
            resolve(false);
        });
      }
    });
  });
}