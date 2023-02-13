'use strict';

const dao = require('./dao');

exports.registerAPIs = (app, passport) => {

    const isLoggedIn = (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.status(401).json({error: 'Not authorized'});
    }

    /*** APIs ***/

    app.get('/api/courses', async (req, res) => {
        try {
            const courses = await dao.getAllCourses();
            for(let i=0; i<courses.length; i++)
                courses[i].inc_courses = await dao.getIncompatibleCourses(courses[i].code);
            return res.status(200).json(courses);
        } 
        catch(err) {
            return res.status(500).json(err.message);
        }
    });

    app.put('/api/studyPlan', isLoggedIn, async (req, res) => {
        const userId = Number(req.user.id);
        const credits = Number(req.body.credits);
        if (!req.body || !Number.isInteger(credits) || credits<0 || !Number.isInteger(userId) || userId<=0 ||
            (req.body.type !== 'Full-time' && req.body.type !== 'Part-time') ||
            (req.body.type === 'Full-time' && (credits<60 || credits>80)) ||
            (req.body.type === 'Part-time' && (credits<20 || credits>40)))
            return res.status(422).json('validation of body and/or user id failed');
        
        try {
            await dao.updateStudyPlan(userId, req.body.type, credits);
            return res.status(200).end();
        }
        catch(err) {
            return res.status(503).json(err.message);
        }
    });

    app.get('/api/studyPlan', isLoggedIn, async (req, res) => {
        const userId = Number(req.user.id);
        if (!Number.isInteger(userId) || userId<=0)
            return res.status(422).json('validation of user id failed');

        try {
            const study_plan = await dao.getStudyPlan(userId);
            if(study_plan.type === 'NULL')
                return res.status(404).json('no study plan associated to user');
            return res.status(200).json(study_plan);
        } 
        catch(err) {
            return res.status(500).json(err.message);
        }
    });

    app.delete('/api/studyPlan', isLoggedIn, async (req, res) => {
        const userId = Number(req.user.id);
        if (!Number.isInteger(userId) || userId<=0)
            return res.status(422).json('validation of user id failed');
    
        try {
            const id = await dao.updateStudyPlan(userId, 'NULL', 0);
            if(id === 0)
                return res.status(404).json('no study plan associated to user');
            const courses = await dao.getStudyPlanCourses(userId);
            for(let i=0; i<courses.length; i++)
                await dao.updateCourseStudents(courses[i].id, -1);
            await dao.deleteStudyPlanCourses(userId);
            return res.status(204).end();
        }
        catch(err) {
            return res.status(503).json(err.message);
        }
    });

    app.post('/api/studyPlan/course', isLoggedIn, async (req, res) => {
        const userId = Number(req.user.id);
        const courseId = Number(req.body.id);
        const max_students = Number(req.body.max_students);
        const act_students = Number(req.body.act_students);
        if (!req.body || !Number.isInteger(courseId) || courseId<=0 || !Number.isInteger(userId) || userId<=0 ||
            !Number.isInteger(act_students) || (max_students && (!Number.isInteger(max_students) || act_students>=max_students)))
            return res.status(422).json('validation of body and/or user id failed');
        
        try {
            await dao.addStudyPlanCourse(userId, courseId);
            await dao.updateCourseStudents(courseId, 1);
            return res.status(201).end();
        }
        catch(err) {
            return res.status(503).json(err.message);
        }
    });

    app.get('/api/studyPlan/courses', isLoggedIn, async (req, res) => {
        const userId = Number(req.user.id);
        if (!Number.isInteger(userId) || userId<=0)
            return res.status(422).json('validation of user id failed');

        try {
            const courses = await dao.getStudyPlanCourses(userId);
            for(let i=0; i<courses.length; i++)
                courses[i].inc_courses = await dao.getIncompatibleCourses(courses[i].code);
            return res.status(200).json(courses);
        } 
        catch(err) {
            return res.status(500).json(err.message);
        }
    });

    /*** Authentication APIs ***/

    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if(err)
                return next(err);
            if(!user) {
                // display wrong login messages
                return res.status(401).send(info);
            }
            // success, perform the login
            req.login(user, (err) => {
                if(err)
                    return next(err);
                
                // req.user contains the authenticated user, we send all the user info back
                return res.status(201).json(req.user);
            });
        })(req, res, next);
      });
    
    app.get('/api/userInfo', (req, res) => {
        if (req.isAuthenticated())
            res.json(req.user);
        else
            res.status(401).json({ error: 'Not authenticated' });
    });

    app.delete('/api/logout', (req, res) => {
        req.logout(() => res.end());
    });
    
}