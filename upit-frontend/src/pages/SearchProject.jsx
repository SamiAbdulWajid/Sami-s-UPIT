import { useState, useEffect } from "react";
import { Footer } from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SearchProject() {

  const gotoViewPage=()=>{
    navigate("/viewProject");
  }

  const navigate=useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects(); // load all projects initially
  }, []);

  const fetchProjects = async (query = "") => {
  try {
    const res = await axios.get("https://sami-s-upit-backend.onrender.com/projects/searchProject", {
      params: { name: query },
    });
    // Always set projects as an array!
   if (res.data.success) {
      setProjects(res.data.data);
    } else {
      setProjects([]);
    }
  } catch (err) {
    console.error(err);
    setProjects([]);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    fetchProjects(searchTerm); // search API
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: "calc(100vh - 120px)", width: "100vw" }}>
        <div style={{ padding: "100px", color: "black", textAlign: "center" }}>
          <h2 style={{ paddingTop: "20px" }}>Search Project</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Project Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="fa-solid fa-magnifying-glass" style={{ color: "#cbcfd7ff" }}></i>
              </button>
            </div>
          </form>

          {/* cards container */}
          <div className="cards-grid">
            {projects.length === 0 ? (
              <p>No Project Found</p>
            ) : (
              projects.map((project, i) => (
                <div className="search-card" key={i}>
                  <h5 className="card-header search-cardheader">
                    Created on: {new Date(project.createdAt).toLocaleDateString()}
                  </h5>
                  <div className="card-body">
                    <h5 className="card-title projectName" style={{ paddingBottom: "10px", marginBottom: "0px" }}>{project.name}</h5>

           <button onClick={() => navigate(`/viewProject/${project._id}`)}
           className="btn btn-warning viewBtn">View</button>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
