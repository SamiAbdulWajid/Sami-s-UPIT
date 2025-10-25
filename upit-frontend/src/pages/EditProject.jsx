

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';

export function EditProject() {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("solo");
  const [participants, setParticipants] = useState([""]);
  const [visibility, setVisibility] = useState("private");
  const [files, setFiles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [creator, setCreator] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/projects/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjectName(data.name);
        setProjectType(data.type);
        setVisibility(data.visibility || "private");
        setFiles(data.files || []);
        setCreator(data.creator);
        if (data.type === "group" && data.participants && data.participants.length > 0) {
          setParticipants(
            data.participants.map(
              p => (typeof p.user === "object" && p.user.username) ? p.user.username : p.user
            )
          );
        } else {
          setParticipants([""]);
        }
      })
      .catch((err) => {
        toast.error("Error fetching project");
        console.error("Error fetching project:", err);
      });
  }, [_id]);

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    let creatorId = creator;
    if (creator && typeof creator === "object" && creator._id) {
      creatorId = creator._id;
    }
    if (creatorId && currentUserId) {
      if (String(creatorId) === String(currentUserId)) {
        setUserRole("creator");
      } else {
        setUserRole("participant");
      }
    }
  }, [creator]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => {
      const allFiles = [...prevFiles, ...selectedFiles];
      const uniqueFiles = [];
      const seen = new Set();
      for (const file of allFiles) {
        const key = file.name + file.size;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueFiles.push(file);
        }
      }
      return uniqueFiles;
    });
  };

  const handleProjectTypeChange = (e) => {
    setProjectType(e.target.value);
    if (e.target.value === "solo") {
      setParticipants([]);
    } else {
      setParticipants([""]);
    }
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const addParticipant = () => setParticipants([...participants, ""]);
  const removeParticipant = (index) =>
    setParticipants(participants.filter((_, i) => i !== index));

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e) => {
  e.preventDefault();

  if (!projectName.trim()) return;

  if (files.length === 0) {
    toast.error("Upload at least one file or folder.");
    return;
  }

  // If projectType is group but participants is empty, convert to solo
  let finalType = projectType;
  let finalParticipants = participants;
  if (projectType === "group" && participants.filter(p => p.trim() !== "").length === 0) {
    finalType = "solo";
    finalParticipants = [];
    toast.info("No participants left, converting project to solo.");
  }

  const metadata = {
    name: projectName,
    type: finalType,
    visibility,
    participants: finalParticipants.filter((p) => p.trim() !== ""),
    files,
  };

  try {
    const res = await fetch(`https://sami-s-upit-backend.onrender.com`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(metadata),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data?.message || data?.error || "Failed to update project";
      toast.error(errMsg);
      return;
    }

    toast.success("Project updated successfully!");
    navigate("/");
  } catch (err) {
    console.error("Error updating project:", err);
    toast.error("Error updating project");
  }
};

  const handleDelete = () => {
    fetch(`http://localhost:8080/projects/${_id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        toast.success("Project deleted successfully!");
        navigate("/");
      })
      .catch((err) => {
        toast.error("Error deleting project", err);
        console.error("Error deleting project:", err)
      });
  };

  // Show a loading spinner while determining userRole
  if (userRole === null) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div>Loading...</div>
    </div>
  );

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="outerbox"
        style={{
          width: "500px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "white",
          padding: "20px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-center mb-3">Edit Project</h3>

        <form
          className="row g-3 needs-validation"
          noValidate
          onSubmit={handleSave}
        >
          {/* Project Name */}
          <div className="col-12">
            <label htmlFor="projectName" className="form-label">
              Project Name
            </label>
            <input
              type="text"
              className="form-control"
              id="projectName"
              placeholder="Enter project name"
              maxLength={16}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter a project name (max 16 chars).
            </div>
          </div>

          {/* File Upload */}
          <div className="col-12">
            <label htmlFor="folderInput" className="form-label">
              Upload Folder
            </label>
            <input
              type="file"
              id="folderInput"
              multiple
              webkitdirectory="true"
              directory="true"
              className="form-control"
              onChange={handleFileChange}
            />
            <div className="invalid-feedback">Please upload at least one file.</div>
            <br />
            <label className="form-label ">Upload Files</label>
            <div
              style={{
                border: "2px dashed #bbb",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                background: "#fafafa",
                cursor: "pointer",
                marginBottom: "8px"
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const fileList = Array.from(e.dataTransfer.files);
                handleFileChange({ target: { files: fileList } });
              }}
            >
              <input
                type="file"
                multiple
                className="form-control mb-2"
                onChange={handleFileChange}
                accept=".js,.py,.java,.txt,.cpp,.c,.json,.html,.css,.md"
                style={{ display: "inline-block", width: "auto" }}
              />
              <div style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
                Drag & drop files here, or click to select files
              </div>
            </div>
            <div
              style={{
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "6px",
                marginTop: "10px",
                marginBottom: "10px",
                padding: "6px"
              }}
            >
              {files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2px 0",
                    borderBottom: idx !== files.length - 1 ? "1px solid #f0f0f0" : "none"
                  }}
                >
                  <span style={{ wordBreak: "break-all" }}>{file.name || file.filename}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-2"
                    style={{ padding: "2px 8px", fontSize: "14px" }}
                    onClick={() => removeFile(idx)}
                    aria-label={`Remove ${file.name || file.filename}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {files.length === 0 && (
              <div className="text-danger mt-2">
                Upload at least one file or folder.
              </div>
            )}
          </div>

          {/* Project Type */}
          <div className="col-12">
            <label htmlFor="projectType" className="form-label">
              Project Type
            </label>
            <select
              className="form-select"
              id="projectType"
              value={projectType}
              onChange={handleProjectTypeChange}
              required
            >
              <option value="solo">Solo</option>
              <option value="group">Group</option>
            </select>
            <div className="invalid-feedback">Please select a project type.</div>
          </div>

          {/* Visibility */}
          <div className="col-12">
            <label className="form-label">Visibility</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="visibilitySwitch"
                checked={visibility === "public"}
                onChange={(e) =>
                  setVisibility(e.target.checked ? "public" : "private")
                }
              />
              <label
                className="form-check-label"
                htmlFor="visibilitySwitch"
              >
                {visibility === "public" ? "Public" : "Private"}
              </label>
            </div>
          </div>

          {/* Participants (only for group) */}
{projectType === "group" && (
  <div className="col-12">
    <label className="form-label">Participants</label>
    <div
      style={{
        maxHeight: "180px",
        overflowY: "auto",
        border: "1px solid #eee",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "8px",
        background: "#fafafa"
      }}
    >
      {participants.map((participant, index) => (
        <div key={index} className="d-flex mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter participant username"
            value={participant}
            onChange={(e) =>
              handleParticipantChange(index, e.target.value)
            }
            required
          />
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={() => removeParticipant(index)}
          >
            -
          </button>
          <div className="invalid-feedback">
            Please enter participant name.
          </div>
        </div>
      ))}
    </div>
    <button
      type="button"
      className="btn btn-success mt-2"
      onClick={addParticipant}
    >
      + Add Participant
    </button>
  </div>
)}

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-between">
            <button
              className="btn btn-warning"
              type="submit"
              disabled={userRole !== "creator"}
              title={userRole !== "creator" ? "Only the creator can edit the project" : ""}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={userRole !== "creator"}
              title={userRole !== "creator" ? "Only the creator can delete the project" : ""}
            >
              Delete Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
