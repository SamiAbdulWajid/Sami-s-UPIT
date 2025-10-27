

import React from "react";
import '../App.css';
import CodeEditor from './CodeEditor';

export function CenterBox({ selectedProject }) {
  if (!selectedProject) {
    return (
      <div className='Box2'>
        <p style={{ padding: "20px", color: "#aaa" }}>Select a project from the left</p>
      </div>
    );
  }

  return (
    <div className='Box2' style={{ padding: 0, boxSizing: "border-box" }}>
      {/* Full center area reserved for the editor */}
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CodeEditor project={selectedProject} />
        </div>
      </div>
    </div>
  );
}