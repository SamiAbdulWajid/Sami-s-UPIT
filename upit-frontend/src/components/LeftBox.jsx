import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

export function LeftBox({ setSelectedProject, selectedProject }) {
  const [mode, setMode] = useState("solo");
  const [projects, setProjects] = useState([]);
  const [isAuthenticated, SetisAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const checkAuthAndFetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8080/users/checkAuth", {
        credentials: "include",
      });
      const data = await res.json();
      SetisAuthenticated(data.isAuthenticated);

      if (data.isAuthenticated) {
        // Only fetch projects if authenticated
        const projectsRes = await fetch("http://localhost:8080/projects/my-projects", {
          credentials: "include"
        });
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data || []);
      } else {
        setProjects([]); // Clear projects if not authenticated
      }
    } catch (error) {
      console.log("Auth Check failed");
      SetisAuthenticated(false);
      setProjects([]);
    }
  };

  checkAuthAndFetchProjects();
}, []);

 const goToDeleteUser = async () => {

  try {
    const res = await fetch("http://localhost:8080/users/checkAuth", {
      credentials: "include",
    });
    const data = await res.json();

    if (!data.isAuthenticated || !data.user?._id) {
      return toast.error("You must be logged in to delete your account.");
    }

    // const confirmDelete=window.confirm(`Do you want to delete this account with username ${data.user.username} ?`);
    // if(!confirmDelete) return;

     const result = await Swal.fire({
      title: "Confirm Deletion",
      html: `Are you sure you want to delete the account with username "<b> ${data.user.username} </b>" ?`,
      icon: "warning",  
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    // Delete user (this also logs out the user in backend)
    await axios.delete(`http://localhost:8080/users/${data.user._id}`, {
      withCredentials: true,
    });

    toast.success("User deleted successfully");
    navigate("/login");
  } catch (err) {
    toast.error("Error deleting user");
    console.log(err);
  }
};

  const goToAddProject = async () => {
    try {
      const res = await fetch("http://localhost:8080/users/checkAuth", {
        credentials: "include"
      });
      const data = await res.json();
      if (!data.isAuthenticated) {
        return toast.error("Please log in to create a project.");
      }
      navigate(`/addproject`);
    } catch {
      toast.error("Please log in to create a project.");
    }
  };

  const goToEditProject = (_id) => {
    navigate(`/edit/${_id}`);
  };

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((p) => p.type === mode)
    : [];

     const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="Box1">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="switch-bar">
          <button
            className={mode === "solo" ? "active" : ""}
            onClick={() => setMode("solo")}
          >
            <i
              className="fas fa-user"
              style={{
                fontSize: "28px",
                color: mode === "solo" ? "#444" : "#999",
              }}
            ></i>
          </button>
          <button
            className={mode === "group" ? "active" : ""}
            onClick={() => setMode("group")}
          >
            <i
              className="fas fa-users"
              style={{
                fontSize: "28px",
                color: mode === "group" ? "#444" : "#999",
              }}
            ></i>
          </button>
        </div>
        <button
          className="btn btn-warning"
          style={{
            border: "2px solid black",
            marginTop: "-1px",
            marginBottom: "9px",
          }}
          onClick={goToAddProject}
        >
          + Add Project
        </button>
      </div>

      {/* Wrapper is flex-grow container */}
      <div className="projects-wrapper">
        {/* Scrollable list inside */}
        <div className="projectsList">
          {sortedProjects.length > 0 ? (
            sortedProjects.map((project) => (
              <React.Fragment key={project._id}>
                <div
                  role="button"
                  className={`card${selectedProject && selectedProject._id === project._id
                      ? " selected"
                      : ""
                    }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="card-header">
                    Created on:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="card-text">
                      Visibility : {project.visibility}
                    </p>
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <button
                        className="btn btn-warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToEditProject(project._id);
                        }}
                      >
                        <i
                          className="fa-regular fa-pen-to-square fa-xs"
                          style={{ color: "#000000" }}
                        ></i>
                        &nbsp; Edit
                      </button>
                    </div>
                  </div>
                </div>
                <br />

              </React.Fragment>

            ))

          ) : (
            <p>No {mode} project</p>
          )}
        </div>
      </div>{isAuthenticated &&<span><button className="btn btn-danger" onClick={goToDeleteUser} style={{marginTop:"10px"}}>Delete Account &nbsp;&nbsp;<i className="fa-solid fa-trash"></i></button></span>}
      
    </div>
  );
}
