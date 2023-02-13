import '../App.css';
import { Row } from 'react-bootstrap';
import { CoursesTable } from '../Components/CoursesTable';

function CoursesPage(props) {
  return(
    <Row className='below-nav'>
      <h1 className='flex-center'>University courses ({props.courses.length})</h1>
      <CoursesTable courses={props.courses} edit={props.edit}/>
    </Row>
  );
}

export { CoursesPage };