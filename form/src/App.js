
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Index from "../src/Routing/Index";
import './App.css'; 
import socket from './Components/Socket/Socket';
import PracticCoode from "./Components/practic/PracticCode";


const App = () => {

  useEffect(()=>{
    socket.connect();

    return (()=>{
      socket.disconnect();
    })
  },[]);


  return (
   
    <Router>
     <PracticCoode/>
      <div className="App">
     
        <main>
          <Index/>
        </main>
       
      </div>
    </Router>
  );
};

export default App;
