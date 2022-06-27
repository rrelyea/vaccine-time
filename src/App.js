import React from 'react';
import BreadCrumbBar from './BreadCrumbBar.js';
import People from './People.js';
import './App.css';



function App() {
  return (
    <div className="App">
      <BreadCrumbBar />
      <br/>
      <h3 className="p-3 text-center">Track and Plan Vaccination Timing for Your Loved Ones</h3>
      <div className="p-3 text-center">NOTE: don't use this as a definitive source yet...This site is a work in progress!</div>
      <div className="p-3 text-center">PRIVACY: Your data is never sent to our server. We don't store anything.</div>
      <br/>
      <People />
    </div>
  );
}

export default App;
