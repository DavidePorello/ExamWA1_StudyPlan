import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Alert } from 'react-bootstrap';
import { MyNavbar } from './Components/Navbar';
import { CoursesPage } from './Pages/CoursesPage';
import { LoginPage } from './Pages/LoginPage';
import { StudyPlanPage } from './Pages/StudyPlanPage';
import API from './API'

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [noHome, setNoHome] = useState(false);

  const getCourses = async () => {
    try {
      const courses = await API.getAllCourses();
      setCourses(courses);
    }
    catch(err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    try {
      await API.getUserInfo();
      setLoggedIn(true);
      setNoHome(true);
    } 
    catch(user) {
      console.log(user);
    }
  };

  useEffect(() => {
    getCourses();
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    } catch(err) {
      console.log(err);
      setMessage({msg: err.message, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
  };

  return (
    <Container className='App' fluid={true}>
      <BrowserRouter>
        <header>
          <MyNavbar loggedIn={loggedIn} logout={handleLogout} noHome={noHome} setNoHome={setNoHome}></MyNavbar>
        </header>
        {message && 
          <Row className='below-nav'>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row>
        }
        <Row>
          <Routes>
            <Route path='/' element={
                loggedIn ? <Navigate replace to='/studyPlan' /> : <CoursesPage courses={courses}/>
              } />
            <Route path='/login' element={
                loggedIn ? <Navigate replace to='/studyPlan' /> : noHome ? <LoginPage login={handleLogin} setMessage={setMessage}/> : <Navigate replace to='/' />
              } />
            <Route path='/studyPlan' element={
                loggedIn ? <StudyPlanPage courses={courses} setCourses={setCourses} getCourses={getCourses} setMessage={setMessage}/> : <Navigate replace to='/' />
              } />
            <Route path='*' element={<h1>404 - page not found</h1>} />
          </Routes>
        </Row>
      </BrowserRouter>
    </Container>
  );
}

export default App;