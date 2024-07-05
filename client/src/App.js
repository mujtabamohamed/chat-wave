import Form from './modules/Form/Form.js';
import Dashboard from './modules/Dashboard/Dashboard.js';
import { Routes, Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ children, auth=false }) {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to={'/users/login'} />;

  } else if(isLoggedIn && ['/users/login', '/users/signup'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />
  }


  return children;
}

function App() {
  return (

    <Routes>
      <Route path='/' element = {
        <ProtectedRoute auth={true}>
          <Dashboard /> 
        </ProtectedRoute>
      } />

      <Route path='/users/login' element = {
        <ProtectedRoute>
          <Form isSignInPage = {true} />
        </ProtectedRoute>
      } />
          
      <Route path='/users/signup' element = {
        <ProtectedRoute>
          <Form isSignInPage = {false} />
        </ProtectedRoute>
      } />
      
    </Routes> 

  );
}

export default App;
