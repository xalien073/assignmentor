// components/AssignmentViewer.js

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SiMicrosoftazure } from "react-icons/si";
import { Box, Card, CardContent, Typography, Button, Grid, CardMedia, CircularProgress } from "@mui/material";

export default function AssignmentViewer({ containerName, tableName, team }) {
  const [assignments, setAssignments] = useState([]);
  const [folderContents, setFolderContents] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const timestamp = new Date().getTime(); // Prevent caching

        // Fetch assignments from the table
        const tableResponse = await fetch(`/api/get-assignments?timestamp=${timestamp}&tableName=${tableName}`);
        if (!tableResponse.ok) throw new Error("Failed to fetch assignments");
        const tableData = await tableResponse.json();

        // Fetch folder contents (images and videos grouped by assignment)
        const blobResponse = await fetch(`/api/get-blob-contents?timestamp=${timestamp}&containerName=${containerName}`);
        if (!blobResponse.ok) throw new Error("Failed to fetch blob contents");
        const blobData = await blobResponse.json();

        const groupedContents = blobData.reduce((acc, blob) => {
          const [parentFolder, subFolder, fileName] = blob.name.split("/");
          if (!acc[parentFolder]) acc[parentFolder] = { Images: [], Videos: [] };
          acc[parentFolder][subFolder].push(blob.url);
          return acc;
        }, {});

        setAssignments(tableData.data || []);
        setFolderContents(groupedContents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [containerName, tableName]);

  const handleFileUpload = async (parentFolder, type, file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("parentFolder", parentFolder);

      const response = await fetch(`/api/upload-file?containerName=${containerName}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const result = await response.json();
      const fileUrl = result.url;

      setFolderContents((prevContents) => {
        const updatedContents = { ...prevContents };
        
        // Initialize the folder structure if it doesn't exist
        if (!updatedContents[parentFolder]) {
          updatedContents[parentFolder] = { Images: [], Videos: [] };
        }
      
        // Check if the file URL already exists in the respective array
        if (!updatedContents[parentFolder][type].includes(fileUrl)) {
          updatedContents[parentFolder][type].push(fileUrl);
        }
      
        return updatedContents;
      });
      alert(`File uploaded successfully! URL: ${fileUrl}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: "block", margin: "auto", marginTop: "20px" }} />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Link
        href="/"
        style={{ marginBottom: "20px", fontSize: "18px", textDecoration: "none", display: "flex", alignItems: "center" }}
      >
        <SiMicrosoftazure style={{ fontSize: "24px", marginRight: "8px" }} />
        <Typography variant="h5" component="span">
          AssignMentor
        </Typography>
      </Link>

      {assignments.reverse().map((assignment) => (
        <Card key={assignment.rowKey} variant="outlined" sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {assignment.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Score: {assignment.completionScore} | Quality Score: {assignment.qualityScore} | Compilation Score: {assignment.compilationScore} | Total Score: {assignment.totalScore}
            </Typography>

            {currentUser && team.includes(currentUser.email) && (
              <Box sx={{ marginTop: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => document.getElementById(`image-upload-${assignment.rowKey}`).click()}
                  sx={{ marginRight: 2 }}
                >
                  Add Image
                </Button>
                <input
                  id={`image-upload-${assignment.rowKey}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(assignment.title, "Images", e.target.files[0])}
                />

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => document.getElementById(`video-upload-${assignment.rowKey}`).click()}
                >
                  Add Video
                </Button>
                <input
                  id={`video-upload-${assignment.rowKey}`}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(assignment.title, "Videos", e.target.files[0])}
                />
              </Box>
            )}

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="subtitle1">Images</Typography>
              <Grid container spacing={2}>
                {(folderContents[assignment.title]?.Images || []).map((url, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <CardMedia
                      component="img"
                      image={url}
                      alt={`Image ${index + 1}`}
                      sx={{ height: 150, objectFit: "cover", borderRadius: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="subtitle1">Videos</Typography>
              <Grid container spacing={2}>
                {(folderContents[assignment.title]?.Videos || []).map((url, index) => (
                  <Grid item xs={12} key={index}>
                    <CardMedia
                      component="video"
                      controls
                      src={url}
                      sx={{ height: 300, width: "100%", borderRadius: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}


// // components/AssignmentViewer.js

// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { SiMicrosoftazure } from "react-icons/si";

// export default function AssignmentViewer({ containerName, tableName, team }) {
//   const [assignments, setAssignments] = useState([]);
//   const [folderContents, setFolderContents] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//     }
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch assignments from the table
//         const timestamp = new Date().getTime(); // Add timestamp to prevent caching
//         const tableResponse = await fetch(`/api/get-assignments?timestamp=${timestamp}&tableName=${tableName}`);
//         if (!tableResponse.ok) throw new Error("Failed to fetch assignments");
//         const tableData = await tableResponse.json();

//         // Fetch folder contents (parent folders and their subfolders)
//         const blobResponse = await fetch(`/api/get-blob-contents?timestamp=${timestamp}&containerName=${containerName}`);
//         if (!blobResponse.ok) throw new Error("Failed to fetch blob contents");
//         const blobData = await blobResponse.json();

//         // Group images and videos by their parent folder
//         const groupedContents = blobData.reduce((acc, blob) => {
//           const [parentFolder, subFolder, fileName] = blob.name.split("/");
//           if (!acc[parentFolder]) acc[parentFolder] = { Images: [], Videos: [] };
//           acc[parentFolder][subFolder].push(blob.url);
//           return acc;
//         }, {});

//         setAssignments(tableData.data || []);
//         setFolderContents(groupedContents);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [containerName, tableName]);

//   const handleFileUpload = async (parentFolder, type, file) => {
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("type", type);
//       formData.append("parentFolder", parentFolder);

//       const response = await fetch(`/api/upload-file?containerName=${containerName}`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("File upload failed");

//       const result = await response.json();
//       const fileUrl = result.url;

//       // Update folderContents state with the new file URL
//       setFolderContents((prevContents) => {
//         const updatedContents = { ...prevContents };
//         if (!updatedContents[parentFolder]) {
//           updatedContents[parentFolder] = { Images: [], Videos: [] };
//         }
//         updatedContents[parentFolder][type].push(fileUrl);
//         return updatedContents;
//       });
//       alert(`File uploaded successfully! URL: ${fileUrl}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Error uploading file. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading data...</p>;
//   }

//   return (
//     <div>
//       <Link href="/" style={{ marginRight: "1em", fontSize: "18px" }}>
//           <SiMicrosoftazure style={{ fontSize: "24px" }} />
//           ssignMentor
//         </Link>
//       {[...assignments].reverse().map((assignment) => (
//         <div key={assignment.rowKey} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
//           <h2>{assignment.title}</h2>
//           <strong>
//             Completion Score: {assignment.completionScore} Quality Score: {assignment.qualityScore} Compilation Score: {assignment.compilationScore} Total Score: {assignment.totalScore}
//           </strong>
//           {currentUser && team.includes(currentUser.email) && (
//           <div>
//             <button
//               onClick={() =>
//                 document.getElementById(`image-upload-${assignment.rowKey}`).click()
//               }
//             >
//               Add Image
//             </button>
//             <input
//               id={`image-upload-${assignment.rowKey}`}
//               type="file"
//               accept="image/*"
//               style={{ display: "none" }}
//               onChange={(e) => handleFileUpload(assignment.title, "Images", e.target.files[0])}
//             />
//             <button
//               onClick={() =>
//                 document.getElementById(`video-upload-${assignment.rowKey}`).click()
//               }
//             >
//               Add Video
//             </button>
//             <input
//               id={`video-upload-${assignment.rowKey}`}
//               type="file"
//               accept="video/*"
//               style={{ display: "none" }}
//               onChange={(e) => handleFileUpload(assignment.title, "Videos", e.target.files[0])}
//             />
//           </div>
//           )}
//           <div>
//             <h3>Images</h3>
//             <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//               {(folderContents[assignment.title]?.Images || []).map((url, index) => (
//                 <img key={index} src={url} alt={`Image ${index + 1}`} style={{ width: "100px", height: "100px" }} />
//               ))}
//             </div>
//           </div>
//           <div>
//             <h3>Videos</h3>
//             <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//               {(folderContents[assignment.title]?.Videos || []).map((url, index) => (
//                 <video key={index} controls style={{ width: "200px", height: "auto" }}>
//                   <source src={url} type="video/mp4" />
//                 </video>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
