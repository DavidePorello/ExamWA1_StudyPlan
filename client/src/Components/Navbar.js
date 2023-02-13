import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Brand() {
    return (
        <Navbar.Brand href="#home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mortarboard-fill" viewBox="0 0 16 16">
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
            </svg>
            {' '}Study Plan
        </Navbar.Brand>
    );
}

function SearchBar() {
    return(
        <Form className='d-flex form-inline my-lg-0 mx-auto'>
            <FormControl type='search' className='me-2' placeholder='Search' aria-label='Search'>
            </FormControl>
        </Form>
    );
}

function LogLink(props) {
    const handleLogout = () => {
        props.setNoHome(false);
        if(props.loggedIn)
            props.logout();
    };

    return(
        <Nav>
            {props.noHome ?
                <Link to='/'>
                    <Button variant={props.loggedIn ? 'danger' : 'light'} onClick={handleLogout}>{props.loggedIn ? 'Logout' : 'Home'}</Button>
                </Link>
            :
                <Link to='/login'>
                    <Button variant='success' onClick={() => props.setNoHome(true)}>Login</Button>
                </Link>
            }
        </Nav>
    );
}

function MyNavbar(props) {
    return (
        <Navbar bg='primary' variant='dark' expand='lg' fixed='top'>
            <Container fluid>
                <Brand></Brand>
                <SearchBar></SearchBar>
                <LogLink loggedIn={props.loggedIn} logout={props.logout} noHome={props.noHome} setNoHome={props.setNoHome}></LogLink>
            </Container>
        </Navbar>
    );
}

export { MyNavbar };