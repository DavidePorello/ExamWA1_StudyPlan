'use strict';

const sqlite = require('sqlite3');
const { Course } = require('./course');

const db = new sqlite.Database('courses.db', err => { if (err) throw err;});

exports.getIncompatibleCourses = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT inc_course FROM inc_courses WHERE code = ?';
    db.all(sql, [code], (err, rows) => {
        if(err)
          reject(err);
        else {
          const inc_courses = rows.map(r => r.inc_course);
          resolve(inc_courses);
        }
    });
  });
};

exports.getAllCourses = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM courses ORDER BY name';
      db.all(sql, [], (err, rows) => {
        if(err)
          reject(err);
        else {
          const courses = rows.map(row => new Course(row.id, row.code, row.name, row.credits, row.max_students, row.act_students, row.prel_course));
          resolve(courses);
        }
      });
    });
};

exports.updateCourseStudents = (id, num) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE courses SET act_students = act_students + ? WHERE id = ?';
    db.get(sql, [num, id], (err) => {
      if(err)
        reject(err);
      else {
        resolve(this.changes);
      }
    });
  });
};

exports.getStudyPlan = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT study_plan, credits FROM users WHERE id = ?';
    db.get(sql, [userId], (err, row) => {
      if(err)
        reject(err);
      else {
        const study_plan = {
          type: row.study_plan,
          credits: row.credits
        };
        resolve(study_plan);
      }
    });
  });
}

exports.updateStudyPlan = (userId, type, credits) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET study_plan = ?, credits = ? WHERE id = ?';
    db.run(sql, [type, credits, userId], function (err) {
      if(err)
        reject(err);
      else {
        resolve(this.changes);
      }
    });
  });
}

exports.getStudyPlanCourses = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM study_plans SP, courses C WHERE SP.course_id = C.id AND user_id = ?';
    db.all(sql, [userId], (err, rows) => {
      if(err)
        reject(err);
      else {
        const courses = rows.map(row => new Course(row.course_id, row.code, row.name, row.credits, row.max_students, row.act_students, row.prel_course));
        resolve(courses);
      }
    });
  });
}

exports.addStudyPlanCourse = (userId, courseId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO study_plans (course_id, user_id) VALUES (?,?)';
    db.run(sql, [courseId, userId], function (err) {
      if(err)
        reject(err);
      else {
        resolve(this.lastID);
      }
    });
  });
}

exports.deleteStudyPlanCourses = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM study_plans WHERE user_id = ?';
    db.run(sql, [userId], function (err) {
      if(err)
        reject(err);
      else {
        resolve(this.changes);
      }
    });
  });    
}