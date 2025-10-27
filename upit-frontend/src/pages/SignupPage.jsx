import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export function SignupPage() {
 const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  }, []);


  const handleonSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("https://sami-s-upit-backend.onrender.com/users/signup", {
        username,
        email,
        password,
      });

      toast.success("You’re all set! Welcome to Upit.");

      navigate("/login")
    
    } catch (e) {
    console.log(e);
toast.error(`Error: ${e.message}`);
navigate("/signup");
    // Reset form fields on error
   
    }
  }

  const handleUsername = (value) => {
    setUsername(value);
  };

  const handleEmail = (value) => {
    setEmail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };





  return (
    <div className="mixof2" style={{ display: "flex", height: "100vh" }}>

      <Header />

      <div className="d-flex justify-content-center align-items-center p-4 bg-light" style={{ flex: 1 }}>
        <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}>
          <h2 className="text-center mb-4">Sign Up</h2>
          <form className="needs-validation" noValidate onSubmit={handleonSubmit}>

            {/* Username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username <sup className="text-danger">*</sup>

              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="John (max 16 characters)"
                onChange={e => handleUsername(e.target.value)}
                maxLength={16}
                required
              />
              <div className="invalid-feedback">Username is required</div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <sup className="text-danger">*</sup>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ex:JohnDoe@gmail.com"
                onChange={e => handleEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback"> Enter a valid email address</div>
            </div>

            {/* Password */}
            <div className="mb-3">
  <label htmlFor="password" className="form-label">
    Create Password <sup className="text-danger">*</sup>
  </label>
  <div className="input-group">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      id="password"
      onChange={e => handlePassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="btn btn-outline-secondary"
      tabIndex={-1}
      onClick={() => setShowPassword((prev) => !prev)}
      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
    >
      {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
    </button>
  </div>
  <div className="invalid-feedback">Password is required</div>
</div>

            <button className="btn btn-primary w-100" type="submit" >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>

  );
}
