import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react"; // or your Monaco wrapper
import axios from "axios";
import Header from "../components/Header";
import { Footer } from "../components/Footer";

export function ViewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/projects/${id}`)
      .then(res => {
        setProject(res.data);
        if (res.data.files && res.data.files.length > 0) {
          setSelectedFile(res.data.files[0]);
        }
      });
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (

   
    <div style={{ padding: "40px" }}> 
    <Header/>
      <h2 style={{display:"flex" ,justifyContent:"center"}}>Project Name :&nbsp;{project.name}</h2>
      
      <div style={{border:"15px solid silver" }}>
        <div style={{ display: "flex", overflowX: "auto" }}>
        {project.files.map((file, idx) => (
          <button
            key={file.id || idx}
            style={{
              minWidth: "120px",
              marginRight: "10px",
              
              background: selectedFile === file ? "#ffc107" : "#676464ff"
            }}
            onClick={() => setSelectedFile(file)}
          >
            {file.filename}
          </button>
        ))}
      </div>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px" }}>
        <MonacoEditor
          height="500px"
          theme="vs-dark"
          language={selectedFile?.language || "plaintext"}
          value={selectedFile?.content || ""}
          options={{ readOnly: true }}
          
        />
      </div>
      </div>
      <Footer/>
    </div>
    
  );
}