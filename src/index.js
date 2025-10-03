import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import Navbar from './components/navbar';
import Insc from './components/Insc';
import Conn from './components/Conn';
import Stat from './components/Stat';
import Friend from './components/Friend';
import List from './components/List';

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Insc />} />
      <Route path="/signin" element={<Conn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/stats" element={<Stat />} />
      <Route path="/friend" element={<Friend />} />
      <Route path="/flightList" element={<List />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
