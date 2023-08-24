import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Doctor from './pages/DoctorPortal';
import Patient from './pages/PatientPortal';
import PatientView from './components/PatientViewer/PatientView';
import PDemo from './pages/PatientDemo';
import Login from './pages/Login';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  if (tokenString == null || tokenString == "undefined") {
    return null;
  }
  console.log(tokenString);
  return tokenString;
  const userToken = JSON.parse(tokenString);
  return userToken
}


function App() {

  const token = JSON.parse(getToken());

  console.log("my token is " + token)
  if (token == null || !token["id"]) {

    console.log("null token, " + token + (token == null))
    return (
      <div>
        <Router>
          <Routes>
            {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
            <Route path='/' element={<Home />} />
            <Route strict path="/create" element={<Navigate to="/login" />} />
            {/* <Route path='/create' element={<Login />} /> */}
            <Route strict path="/patient" element={<Navigate to="/login" />} />
            {/* <Route path='/patient' element={<Patient />} /> */}
            {/* <Redirect strict from="/patient-demo" to="/login" /> */}
            <Route path='/patient-demo' element={<PDemo />} />
            <Route strict path="/view" element={<Navigate to="/login" />} />
            {/* <Route path='/view' element={<PatientView />} /> */}
            <Route path='/login' element={<Login />} />
          </Routes>
        </Router>


      </div>
    );
  }
  else if (token["role"] == "doctor") {

    return (
      <div>
        <Router>
          <Routes>
            {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Doctor token={token} />} />
            {/* <Route path='/patient' element={<Patient />} /> */}
            <Route path='/patient-demo' element={<PDemo />} />
            <Route path='/view' element={<PatientView token={token} />} />
            <Route path='/login' element={<Navigate to="/" />} />
          </Routes>
        </Router>


      </div>
    );
  }
  else {
    return (
      <div>
        <Router>
          <Routes>
            {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
            <Route path='/' element={<Home />} />
            {/* <Route path='/create' element={<Doctor />} /> */}
            <Route path='/patient' element={<Patient token={token} />} />
            <Route path='/patient-demo' element={<PDemo />} />
            {/* <Route path='/view' element={<PatientView />} /> */}
            {/* <Route path='/login' element={<Login />} /> */}
            <Route path='/login' element={<Navigate to="/" />} />
          </Routes>
        </Router>


      </div>
    );
  }
}

export default App;
