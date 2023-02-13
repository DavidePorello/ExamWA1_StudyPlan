import  { Row, Col, Button } from 'react-bootstrap';

function ButtonsNewStudyPlan(props) {
    return(
        <>
            <Row><p></p></Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => props.setStudyPlan("Full-time")}>New full-time study plan</Button>
                </Col>
                <Col >
                    <Button variant="primary" onClick={() => props.setStudyPlan("Part-time")}>New part-time study plan</Button>
                </Col>
            </Row>
        </>
    );
}

export {ButtonsNewStudyPlan};
  