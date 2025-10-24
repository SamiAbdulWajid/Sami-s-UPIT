// import React, { useState } from "react";
// import '../App.css';
// import CodeEditor from './CodeEditor';
// import FolderTree from 'react-folder-tree';

// function buildFileTree(files) {
//   const root = { name: "root", children: [] };
//   files.forEach((filePath) => {
//     const parts = filePath.split("/");
//     let current = root;
//     parts.forEach((part, idx) => {
//       let node = current.children.find(child => child.name === part);
//       if (!node) {
//         node = { name: part };
//         if (idx < parts.length - 1) node.children = [];
//         current.children.push(node);
//       }
//       current = node;
//     });
//   });
//   return root;
// }

// export function CenterBox({ selectedProject }) {
//  const [selectedFile, setSelectedFile] = useState(null);
//  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
 
//     // return (
//     //     <>
//     //         <div className='Box2'>
//     //             {selectedProject ? (
//     //     <CodeEditor project={selectedProject} />
//     //   ) : (
//     //     <p style={{ padding: "20px", color: "#aaa" }}>Select a project from the left</p>
//     //   )}
//     //         </div>
//     //     </>
//     // );

// if(!selectedProject){
//   return (
//       <div className='Box2'>
//         <p style={{ padding: "20px", color: "#aaa" }}>Select a project from the left</p>
//       </div>
//     );
// }

// console.log(selectedProject.files);
// const fileTree = selectedProject && selectedProject.files
//   ? buildFileTree(
//       selectedProject.files
//         .map(f =>  f.filename)
//         .filter(Boolean) // <-- This removes undefined/null/empty
//     )
//   : { name: "root", children: [] };

// return (
//   <div className='Box2' style={{ padding: 0, boxSizing: "border-box" }}>
//     <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
//       {/* File tree (left, 1/4 of width) */}
//       <div
//         style={{
//           flex: 1,
//           minWidth: 120,
//           maxWidth: 300,
          
//           color:"#fff",
//           background: "#1e1e1e",
//           border:"11px solid silver",
//           overflowY: "auto",
//           padding: "8px 0"
//         }}
//       >
//         <FolderTree
//           data={fileTree}
//           showCheckbox={false}
//           onNameClick={(state) => {
            
//            if (!state.children) {
//               const idx = selectedProject.files.findIndex(f => f.filename === state.name);
//       if (idx !== -1) setSelectedFileIndex(idx);
//            }
//           }}
//         />
//       </div>
//       {/* Code editor (right, 3/4 of width) */}
//       <div style={{ flex: 3, minWidth: 0 }}>
//         {/* {selectedFile ? (
//             <CodeEditor project={selectedProject}  selectedFileIndex={selectedFileIndex}/>
//           ) : (
//             <p style={{ padding: "20px", color: "#aaa" }}>Select a file from the file tree</p>
//           )} */}

//           {selectedProject.files && selectedProject.files.length > 0 ? (
//   <CodeEditor project={selectedProject} selectedFileIndex={selectedFileIndex} />
// ) : (
//   <p style={{ padding: "20px", color: "#aaa" }}>Select a file from the file tree</p>
// )}
//       </div>
//     </div>
//   </div>
// );
// }



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