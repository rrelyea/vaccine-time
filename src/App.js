import React from 'react';
import BreadCrumbBar from './BreadCrumbBar.js';
import People from './People.js';
import * as constantsSite from './constants-site.js';
import * as constantsBranch from './constants-branch.js';
import './App.css';



function App() {
  return (
    <div className="App">
      <BreadCrumbBar />
      <br/>
      <h3 className="p-3 text-center">Track and Plan Vaccination Timing for Your Loved Ones</h3>
      <br/>
      <People />
    </div>
  );
}

export default App;
