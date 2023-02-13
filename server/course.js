'use strict';

function Course(id, code, name, credits, max_students, act_students, prel_course, inc_courses = []) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.max_students = max_students;
    this.act_students = act_students;
    this.prel_course = prel_course;
    this.inc_courses = inc_courses;
}

exports.Course = Course;