import { Table } from 'react-bootstrap';

function StudyPlanTable(props) {
    return(
      <Table striped>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {
            props.spCourses.map(c => <StudyPlanRow course={c} key={c.code} />)
          }
        </tbody>
      </Table>
    );
}

function StudyPlanRow(props) {
    return(
      <tr>
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
      </tr>
    );
}

export { StudyPlanTable };