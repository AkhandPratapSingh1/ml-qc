import React from 'react';
import Routes from './Routes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Routes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
