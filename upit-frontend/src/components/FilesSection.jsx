
export default function FilesSection({files}){
  <div
  style={{
    flex: 1,
    display: "flex",
    alignItems: "center",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    border: "1px solid #444",
    padding: "5px",
    borderRadius: "0px",
  }}
>
  {files.length === 0 ? (
    <span style={{ color: "#aaa" }}>No files yet</span>
  ) : (
    files.map((file, index) => (
      <div
        key={index}
        style={{
          padding: "4px 8px",
          marginRight: "5px",
          background: "#4b4b4bff",
          color: "#fff",
          borderRadius: "4px",

          cursor: "pointer"
        }}

        onClick={() => {
          setSelectedFileIndex(index);
          setLanguage(files[index].language); // auto switch language
        }}
      >
        {file.name}
      </div>

    )))}
</div>
}

