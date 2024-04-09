import React from 'react';
import MainApp from './MainApp';
import './css/App.css';
import './css/MainApp.css';
import './css/Toggle.css';

function App() {

  return (
    <div className='App'>
      {/* <label>
        <input onChange={toggleDarkMode} type='checkbox' id='toggle'></input>
        <div className='toggle-wrapper'><span className='selector'></span></div>
      </label> */}
      <MainApp/>
    </div>
  );
}

export default App;
