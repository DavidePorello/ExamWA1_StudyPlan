import '../App.css';
import { Col } from 'react-bootstrap';
import { LoginForm } from '../Components/LoginForm';

function LoginPage(props) {
    return(
        <div className='flex-center below-nav'>
            <Col className='bg-white col-6 text-center'>
                <h1>Login</h1>
                <LoginForm login={props.login} setMessage={props.setMessage} />
            </Col>
        </div>
    );
}

export { LoginPage };