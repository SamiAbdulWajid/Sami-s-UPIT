

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { EditProject } from './pages/EditProject.jsx'
import { AddProject } from './pages/AddProject.jsx';
import { SearchProject } from './pages/SearchProject.jsx';
import { ViewPage }from './pages/ViewPage.jsx';
import NotFound from "./pages/NotFound";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route path="/edit/:_id" element={<EditProject />}></Route>
      <Route path="/addproject" element={<AddProject />}></Route>
      <Route path="/searchProject" element={<SearchProject />}></Route>
      <Route path="/viewProject/:id" element={<ViewPage />}></Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  </BrowserRouter>
);

