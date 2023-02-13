import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      if(username.length === 7) {
        const credentials = { username, password };
        props.login(credentials);
      }
      else {
        props.setMessage('');
        props.setMessage({msg: 'Please enter a valid username', type: 'danger'});
      }
  };

  const resetForm = () => {
    props.setMessage('');
    setUsername('');
    setPassword('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} required={true} length={7}/>
      </Form.Group>

      <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
      </Form.Group>

      <Button variant='primary' type='submit'>Login</Button>&nbsp;
      <Button variant='danger' onClick={resetForm}>Cancel</Button>
    </Form>
  );
}

export { LoginForm };