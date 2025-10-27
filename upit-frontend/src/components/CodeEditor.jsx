

import FilesSection from "./FilesSection";
import axios from "axios"; 
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";

export default function CodeEditor({ project }) {
  const [language, setLanguage] = useState("javascript");
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (project?.files) {
      setFiles(project.files);
      setSelectedFileIndex(0); // reset to first file
    }
  }, [project]);

  const selectedFile = files[selectedFileIndex];

  function handleEditorChange(value) {
    setFiles(prevFiles => {
      const updated = [...prevFiles];
      updated[selectedFileIndex] = {
        ...updated[selectedFileIndex],
        content: value
      };
      return updated;
    });
  }

  async function handleSave() {
    console.log("Save button clicked ✅");

    if (!project || !project._id) { 
      console.error("❌ Save error: Project ID is missing. Cannot save.");
      return;
    }

    try {
      // PATCH to /projects/:_id/files for file updates
      const res = await axios.patch(
        `${API_URL}/projects/${project._id}/files`,
        { files: files },
        { withCredentials: true }
      );
      console.log("✅ Project files updated successfully:", res.data);
      toast.success("Changes saved successfully");
    } catch (err) {
      console.error("❌ Save error:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.status, err.response.data);
        toast.error(err.response.data?.message || "Failed to save changes");
      } else {
        toast.error("Failed to save changes");
      }
    }
  }

  if (!selectedFile) {
    return <p style={{ padding: "20px", color: "#aaa" }}>No files found in this project</p>;
  }

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", border: "10px solid silver" }}>
      {/* Language selector and file tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", height: "50px" }}>
        <select
          value={selectedFile.language}
          onChange={(e) => {
            const lang = e.target.value;
            setFiles((prevFiles) => {
              const updated = [...prevFiles];
              updated[selectedFileIndex] = {
                ...updated[selectedFileIndex],
                language: lang,
              };
              return updated;
            });
          }}
          style={{ marginBottom: "0px", padding: "5px", width: "12%" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="python">Python</option>
          <option value="php">PHP</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>

        {/* File tabs */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            border: "1px solid #444",
            padding: "4px 8px",
            borderRadius: "0px",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 8px",
                marginRight: "5px",
                background: "#4b4b4bff",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedFileIndex(index);
                setLanguage(file.language); // auto switch language
              }}
            >
              <span style={{ flex: 1 }}>{file.filename}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedFiles = files.filter((_, i) => i !== index);
                  setFiles(updatedFiles);
                }}
                style={{
                  marginLeft: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </span>
            </div>
          ))}
        </div>

        <button className="SaveButton" onClick={handleSave}>Save</button>
      </div>

      {/* Monaco Code Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          defaultValue="// Start coding"
          language={selectedFile.language}
          theme="vs-dark"
          path={selectedFile.name}
          value={selectedFile.content}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}