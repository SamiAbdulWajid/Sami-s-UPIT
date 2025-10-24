import Header from './components/Header';
import  SignUp  from './components/SignUp';
import Login from './components/Login';
import './App.css'
import { Footer } from './components/Footer';
import { LeftBox } from './components/LeftBox';
import { RightBox } from './components/RightBox';
import { CenterBox } from './components/CenterBox';
import {LoginPage} from './pages/LoginPage';
import {SignupPage} from './pages/SignupPage';
import {AddProject} from './pages/AddProject';
import { useState } from 'react';


 function App() {
  
  const [selectedProject,setSelectedProject]=useState(null);
  return (
    <>
      <Header className="header"/>
      
      <div style={{display:'flex'}}>
        <LeftBox setSelectedProject={setSelectedProject} selectedProject={selectedProject}/>
        <CenterBox selectedProject={selectedProject}/>
        <RightBox/>
      </div>
      
      <Footer/>
    </>
    
  ); 
} 

export default App; 

