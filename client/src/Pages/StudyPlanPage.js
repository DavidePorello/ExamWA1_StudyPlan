import '../App.css';
import { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { CoursesTable } from '../Components/CoursesTable';
import { ButtonsNewStudyPlan } from '../Components/ButtonsNewStudyPlan';
import { StudyPlanTable } from '../Components/StudyPlanTable';
import API from '../API'

function StudyPlanPage(props) {
  const [spCourses, setSpCourses] = useState([]);
  const [credits, setCredits] = useState(0);
  const [studyPlan, setStudyPlan] = useState(false);
  const [edit, setEdit] = useState(false);

  const getStudyPlan = async () => {
    try {
      setCredits(0);
      setSpCourses([]);
      const study_plan = await API.getStudyPlan();
      setStudyPlan(study_plan.type);
      setCredits(study_plan.credits);
      const courses = await API.getStudyPlanCourses();
      setSpCourses(courses);
    }
    catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStudyPlan();
  }, []);

  const classifyCourses = () => {
    for(let course of props.courses) {
      props.setCourses(courses => courses.map(c => {
        if(c.code === course.code) {
          c.status = 'add';
          c.message = '';
        }
        return c;
      }));
      
      let prel = course.prel_course ? false : true;
      if(course.max_students && course.act_students >= course.max_students) {
        props.setCourses(courses => courses.map(c => {
          if(c.code === course.code) {
            c.status = 'noAdd';
            c.message = 'Course full';
          }
          return c;
        }));
      }
      else {
        for(let i=0; i<spCourses.length; i++) {
          if(spCourses[i].prel_course === course.code) {
            props.setCourses(courses => courses.map(c => {
              if (c.code === course.code) {
                c.status = 'noRemove';
                c.message = `Preparatory course of ${spCourses[i].code}`;
              }
              return c;
            }));
            break;
          }
          if(course.code === spCourses[i].code) {
            props.setCourses(courses => courses.map(c => {
              if (c.code === course.code) {
                c.status = 'remove';
                c.message = 'Already in the study plan';
              }
              return c;
            }));
          }
          for(let x=0; x<course.inc_courses.length; x++) {
            if(course.inc_courses[x] === spCourses[i].code) {
              props.setCourses(courses => courses.map(c => {
                if(c.code === course.code) {
                  c.status = 'noAdd'; //incompatible course found
                  c.message = `Incompatible course in study plan: ${course.inc_courses[x]}`;
                }
                return c;
              }));
              break;
            }
          }
          if(course.prel_course && course.prel_course === spCourses[i].code)
            prel = true; //preparatory course already added
        }
        if(!prel) {
          props.setCourses(courses => courses.map(c => {
            if(c.code === course.code) {
              c.status = 'noAdd'; //preparatory course missed
              c.message = `Preparatory course missed: ${course.prel_course}`;
            }
            return c;
          }));
        }
      }
    }
  };

  useEffect(() => {
    classifyCourses();
  }, [spCourses, edit]);

  const deleteStudyPlan = async () => {
    try {
      await API.deleteStudyPlan();
      props.getCourses(); //update the enrolled students
      setStudyPlan(false);
      setCredits(0);
      setSpCourses([]);
      setEdit(false);
      props.setMessage({msg: 'Study plan deleted', type: 'danger'});
    }
    catch(err) {
      console.log(err);
    }
  };

  const saveStudyPlan = async () => {
    try {
      if((studyPlan === 'Full-time' && credits>=60 && credits<=80) || (studyPlan === 'Part-time' && credits>=20 && credits<=40)) {
        await API.deleteStudyPlan();
        await API.createNewStudyPlan(studyPlan, credits, spCourses);
        props.getCourses(); //update the enrolled students 
        props.setMessage({msg: 'Study plan saved', type: 'success'});
        setEdit(false);
      }
      else
        props.setMessage({msg: 'Cannot save the study plan: credits constraints not respected', type: 'danger'});
    }
    catch(err) {
      console.log(err);
    }
  };

  const cancelStudyPlan = () => {
    getStudyPlan(); 
    setEdit(false);
    props.setMessage({msg: 'Study plan modifications not saved', type: 'warning'});
  };

  const addStudyPlanCourse = (course) => {
    props.setMessage('');
    setSpCourses(courses => [...courses, course]);
    setCredits(credits => credits + course.credits);
  };

  const deleteStudyPlanCourse = (course) => {
    props.setMessage('');
    setSpCourses(courses => courses.filter(c => c.code !== course.code));
    setCredits(credits => credits - course.credits);
  }

  return(
    <Row className='below-nav'>
      <Col sm={8}>
        <h1>University courses ({props.courses.length})</h1>
        <CoursesTable courses={props.courses} edit={edit} addStudyPlanCourse={addStudyPlanCourse} deleteStudyPlanCourse={deleteStudyPlanCourse}/>
      </Col>
      <Col sm={4}>
        <h1>Study plan</h1>
        {studyPlan ? 
          <>
            <Card style={{ width: '18rem' }}>
              <Card.Header>{studyPlan} study plan</Card.Header>
              <ListGroup variant='flush'>
                <ListGroup.Item>Actual credits: {credits}</ListGroup.Item>
                <ListGroup.Item>Min credits: {studyPlan === 'Full-time' ? 60 : 20}</ListGroup.Item>
                <ListGroup.Item>Max credits: {studyPlan === 'Full-time' ? 80 : 40}</ListGroup.Item>
              </ListGroup>
            </Card>
            <StudyPlanTable spCourses={spCourses} />
            {edit ?
              <>
                <Button variant='success' onClick={saveStudyPlan}>Save</Button>&nbsp;
                <Button variant='secondary' onClick={cancelStudyPlan}>Cancel</Button>&nbsp;
                <Button variant='danger' onClick={deleteStudyPlan}>Delete</Button>
              </>
            : 
              <Button variant='primary' onClick={() => {setEdit(true); props.setMessage('');}}>Edit</Button>
            }
          </>
        :
          <ButtonsNewStudyPlan setStudyPlan={setStudyPlan}/>
        }
      </Col>
    </Row>
  );
}

export { StudyPlanPage };