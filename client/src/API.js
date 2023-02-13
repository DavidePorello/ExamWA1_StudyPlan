const SERVER_URL = 'http://localhost:3001';

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + '/api/courses');
  const courses = await response.json();
  if(response.ok)
    return courses;
  else
    throw courses;
};

const getStudyPlan = async () => {
  const response = await fetch(SERVER_URL + '/api/studyPlan', {
    credentials: 'include'
  });
  const study_plan = await response.json();
  if(response.ok)
    return study_plan;
  else
    throw study_plan;
};

const getStudyPlanCourses = async () => {
  const response = await fetch(SERVER_URL + '/api/studyPlan/courses', {
    credentials: 'include'
  });
  const courses = await response.json();
  if(response.ok)
    return courses;
  else
    throw courses;
};

const createNewStudyPlan = async (study_plan, credits, spCourses) => {
  const spJson = {
    type: study_plan,
    credits: credits
  };
  let response;
  response = await fetch(SERVER_URL + '/api/studyPlan', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spJson),
    credentials: 'include'
  })
  
  if(!response.ok)
    throw await response.json();
  
  let spCourseJson;
  for(let i=0; i<spCourses.length; i++) {
    spCourseJson = {
      id: spCourses[i].id,
      max_students: spCourses[i].max_students,
      act_students: spCourses[i].act_students
    }
    response = await fetch(SERVER_URL + '/api/studyPlan/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spCourseJson),
      credentials: 'include'
    })

    if(!response.ok)
      throw await response.json();
  }
};

const deleteStudyPlan = async () => {
  const response = await fetch(SERVER_URL + '/api/studyPlan', {
    method: 'DELETE',
    credentials: 'include'
  })
  if(!response.ok)
    throw await response.json();
};

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  const user = await response.json();
  if(response.ok) {
    return user;
  }
  else {
    throw user;
  }
};
  
  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/userInfo', {
      credentials: 'include',
    });
    const user = await response.json();
    if(response.ok) {
      return user;
    } else {
      throw user; 
    }
};
  
  const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/logout', {
      method: 'DELETE',
      credentials: 'include'
    });
    if(response.ok)
      return null;
};

const API = { getAllCourses, getStudyPlan, getStudyPlanCourses, createNewStudyPlan, deleteStudyPlan, logIn, getUserInfo, logOut };
export default API;