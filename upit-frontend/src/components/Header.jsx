import Login from "./Login";
import Logo from "./Logo";
import ProfileModal from "./ProfileModal";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header({theme,setTheme}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    axios
      .get(`${API_URL}/users/checkAuth`, { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(res.data.isAuthenticated);
        setUser(res.data.user || null);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, [showProfile]); // re-fetch when modal closes (in case user updates DP)

  const handleLogout = () => {
    axios
      .get(`${API_URL}/users/logout`, { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
        toast.success("Logged out successfully");
        navigate("/login");
      })
      .catch(() => toast.error("Logout Failed"));
  };

  // Get fallback letter for DP
  const dpFallback = user?.username ? user.username[0].toUpperCase() : "?";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top px-4">
        <div
          className="container-fluid"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <Logo style={{ width: "150px", height: "60px" }} />

          <div className="ms-auto d-flex gap-2 align-items-center">
            
  

            {isAuthenticated ? (
              <>
                {/* Profile Icon Button */}
               {/* Profile Icon Button */}
<button
  type="button"
  onClick={() => setShowProfile(true)}
  style={{
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "#abaf70ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
    marginRight: "8px",
    overflow: "hidden",
    fontWeight: "bold",
  }}
  title="Profile"
>
  {dpFallback}
</button>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{ borderRadius: "0px" }}
                >
                  Logout
                </button>
                {/* Profile Modal */}
                <ProfileModal
                  show={showProfile}
                  onClose={() => setShowProfile(false)}
                />
              </>
            ) : (
              <Login />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;