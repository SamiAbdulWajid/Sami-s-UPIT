import {React,useEffect,useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Footer } from "../components/Footer";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';


export function LoginPage() {
  const [email,setEmail]=useState("");
  const[password,setPassword]=useState("");
const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const goToSignup = () => {
    navigate("/signup")
  }

  const handleSubmit=async (event)=>{
  event.preventDefault();
  try{
    const res=await axios.post("https://sami-s-upit-backend.onrender.com",{
      username:email,
      password
    },
    { withCredentials: true }
  )

  console.log("Login response:", res.data);

  if (res.data && res.data.user && res.data.user._id) {
  localStorage.setItem("userId", res.data.user._id);
}

    toast.success("Welcome back to Upit old friend");

    setEmail("");
    setPassword("")

    navigate("/");

  }catch(err){
     toast.error("Invalid email or password. Please try again.");
  }
  }

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

  return (
    <div style={{ height: "100%" }}>
      <div className="mixof2" style={{ display: "flex", height: "100vh" }}>
        <Header/>
        {/* Left: form */}
        <div className="d-flex justify-content-center align-items-center p-4 bg-light" style={{ flex: 1 }}>
          <div className="card shadow-sm p-4 loginBox" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}>
            <h2 className="text-center mb-4">Login</h2>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <sup className="text-danger">*</sup>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  placeholder="Ex:abc@gmail.com"
                  onChange={e=>setEmail(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Enter a valid email address</div>
              </div>

              {/* Password */}
             <div className="mb-3">
  <label htmlFor="password" className="form-label">
    Password
  </label>
  <div className="input-group">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      id="password"
      onChange={e => setPassword(e.target.value)}
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

              <button className="btn btn-primary w-100" type="submit">
                Login
              </button>
              <br />
              <p style={{ marginBottom: "0px", paddingTop: "2px" }}>  Don't have an account ? Click here to <span role='button' onClick={goToSignup} style={{ textColor: "blue", textDecoration: "underline" }}>Sign up</span></p>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
