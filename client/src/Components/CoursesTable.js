import { Table, Accordion, Button, Row, Col } from 'react-bootstrap';

function CoursesTable(props) {
  return(
    <Table striped>
      <thead>
        <tr>
          {props.edit && <th>Add/remove</th>}
          <th>Code</th>
          <th>Name</th>
          <th>Credits</th>
          <th>Max students</th>
          <th>Enrolled students</th>
          {props.edit ? 
            <th>Constraints</th>
          :
            <th>Incompatible/preparatory courses</th>
          }
        </tr>
      </thead>
      <tbody>
        {
          props.courses.map((c) => <CourseRow course={c} key={c.code} edit={props.edit} addStudyPlanCourse={props.addStudyPlanCourse} deleteStudyPlanCourse={props.deleteStudyPlanCourse}/>)
        }
      </tbody>
    </Table>
  );
}
  
function CourseRow(props) {
  let statusClass = '';
  switch (props.course.status) {
    case ('remove'):
      statusClass = 'bg-success';
      break;
    case ('noRemove'):
      statusClass = 'bg-success';
      break;
    case ('noAdd'):
        statusClass = 'bg-danger';
        break;
    default:
        break;
  }

  return(
    <tr className={props.edit ? statusClass : ''}>
      {props.edit && props.course.status === 'add' && <td><Button variant="success" className="rounded-circle" onClick={() => props.addStudyPlanCourse(props.course)}>+</Button></td>}
      {props.edit && props.course.status === 'remove' && 
        <td>
          <Button variant='danger' onClick={() => props.deleteStudyPlanCourse(props.course)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </Button>
        </td>
      }
      {props.edit && (props.course.status === 'noAdd' || props.course.status === 'noRemove') && <td></td>}
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <td>{props.course.max_students}</td>
      <td>{props.course.act_students}</td>
      {props.edit ? 
        <td>{props.course.message}</td>
      :
        <td>
            <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <Row>
                    <Col>{props.course.inc_courses.length} incompatible courses</Col>
                    <Col>{props.course.prel_course ? '1 preparatory course' : 'No preparatory course'}</Col>
                  </Row>
                </Accordion.Header>
                {(props.course.inc_courses.length !== 0 || props.course.prel_course) &&
                <Accordion.Body>
                  <Row>
                    <Col>{props.course.inc_courses.map((code) => <p key={code}>{code}</p>)}</Col>
                    <Col>{props.course.prel_course ? props.course.prel_course : ''}</Col>
                  </Row>
                </Accordion.Body>
                }
            </Accordion.Item>
            </Accordion>
        </td>
      }
    </tr>
  );
}

export { CoursesTable };