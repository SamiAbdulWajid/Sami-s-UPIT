

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

export default function ProfileModal({ show, onClose }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);
  const fileInputRef = useRef();
 const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (show) {
      fetch(`${API_URL}/users/checkAuth`, { credentials: "include" })
        .then(res => res.json())
        .then(data => setUser(data.user || null));
      fetch(`${API_URL}/projects/my-projects`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setProjects(data.data || []);
          // Uncomment to debug project structure:
          console.log("Fetched projects:", data.data);
        });
    }
  }, [show]);

  // Profile picture upload handler
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    const res = await fetch(`${API_URL}/users/uploadProfilePic`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (data.profilePic) {
      setUser((prev) => ({ ...prev, profilePic: data.profilePic }));
      toast.success("Profile picture updated!");
    } else {
      toast.error(data.message || "Failed to upload profile picture");
    }
  };

  // Logout handler
  const handleLogout = () => {
    fetch(`${API_URL}/users/logout`, { credentials: "include" })
      .then(() => {
        toast.success("Logged out successfully!");
        setTimeout(() => window.location.reload(), 1000);
      });
  };

  // Robust project counting
  const userId = user?._id;
  const groupCount = projects.filter((p) => {
    if (p.type !== "group") return false;
    // Check creator
    const creatorId = typeof p.creator === "object" ? p.creator._id : p.creator;
    if (creatorId === userId) return true;
    // Check participants
    if (Array.isArray(p.participants)) {
      return p.participants.some(pt => {
        if (!pt.user) return false;
        return (typeof pt.user === "object" ? pt.user._id : pt.user) === userId;
      });
    }
    return false;
  }).length;

  const soloCount = projects.filter((p) => {
    if (p.type !== "solo") return false;
    const creatorId = typeof p.creator === "object" ? p.creator._id : p.creator;
    return creatorId === userId;
  }).length;

  // Get first letter for DP fallback
  const dpFallback = user?.username ? user.username[0].toUpperCase() : "?";

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "32px", minWidth: "320px", boxShadow: "0 4px 24px #0002"
      }}>
        <h3 className="mb-3 text-center">User Profile</h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          {/* Profile Picture or Fallback */}
          <div
            style={{
              width: 64, height: 64, borderRadius: "50%", background: "#eee",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: "bold",
              position: "relative", cursor: "pointer"
            }}
            onClick={() => fileInputRef.current.click()}
            title="Click to upload/change profile picture"
          >
           {dpFallback}
            {/* Hidden file input */}
            
          </div>
          {/* Username with edit icon */}
          <div style={{ fontSize: 18 }}>
            <b>Username:</b> {user?.username}
            <button type="button" style={{ border: "none", background: "none", marginLeft: 8 }}>
              <i className="fa fa-pen"></i>
            </button>
          </div>
          {/* Password field with eye and edit icon */}
         {/* Password field with eye and edit icon */}
<div style={{ width: "100%" }}>
  <b>Password:</b>
  <div className="input-group mt-1">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      value={editingPassword ? newPassword : ""}
      readOnly={!editingPassword}
      style={{ maxWidth: 140, display: "inline-block" }}
      onChange={e => setNewPassword(e.target.value)}
      placeholder={editingPassword ? "Enter new password" : "********"}
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
    <button
      type="button"
      className="btn btn-outline-secondary ms-2"
      onClick={() => setEditingPassword((prev) => !prev)}
    >
      <i className="fa fa-pen"></i>
    </button>
  </div>
  {editingPassword && (
    <button
      className="btn btn-sm btn-primary mt-2"
      onClick={async () => {
        if (!newPassword || newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        const res = await fetch(`${API_URL}/users/updatePassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Password updated successfully!");
          setEditingPassword(false);
          setNewPassword("");
        } else {
          toast.error(data.message || "Failed to update password");
        }
      }}
    >
      Save Password
    </button>
  )}
</div>
          {/* Project counts */}
          <div>
            <b>Group Projects:</b> {groupCount} <br />
            <b>Solo Projects:</b> {soloCount}
          </div>
          {/* Logout Button */}
         
          {/* Close Button */}
          <button className="btn btn-secondary mt-2 w-100" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}