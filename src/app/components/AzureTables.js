// components/AzureTables.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { SiMicrosoftazure } from "react-icons/si";
import Leaderboard from "./Leaderboard";

const AzureGrids = (currentUser) => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [tablesData, setTablesData] = useState({
    teamA: [],
    teamB: [],
    teamC: [],
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
  });
  const [gradeQuiz, setGradeQuiz] = useState({
    rKey: '',
    airForce1: 0,
    technoManiaks: 0,
    azureAscendants: 0,
  });
  const [gradeAssignment, setGradeAssignment] = useState({
    table: "",
    team: "",
    assignmentTitle: "",
    completionScore: 0,
    qualityScore: 0,
    compilationScore: 0,
    totalScore: 0,
  });

  useEffect(() => {
    async function fetchQuizzesData() {
      try {
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        const response = await fetch(`/api/getQuizzes?timestamp=${timestamp}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(data.data);
        // console.table(data.data);
      } catch (error) {
        console.error("Error fetching Quizzes data:", error.message);
        throw error;
      }
    }

    async function fetchAzureTablesData() {
      try {
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        const response = await fetch(
          `/api/getAzureTables?timestamp=${timestamp}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTablesData({
          teamA: data.AirForce1,
          teamB: data.TechnoManiaks,
          teamC: data.AzureAscendants,
        });
        // console.table(data);
      } catch (error) {
        console.error("Error fetching Azure Tables data:", error.message);
        throw error;
      }
    }

    fetchQuizzesData();
    fetchAzureTablesData();
  }, []);

  const handleQuiz = async () => {
    try {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      const currentTime = new Date().toISOString();

      const rowData = {
        partitionKey: currentMonth,
        rowKey: currentTime,
        title: `Quiz ${quizzes.length + 1} ${currentMonth}`,
        airForce1: 0,
        technoManiaks: 0,
        azureAscendants: 0,
      };
      const response = await fetch("/api/azureTableQuizInsertion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to insert row:", errorData);
        throw new Error(errorData.message || "Unknown error occurred");
      }

      const result = await response.json();
      console.log("Row inserted successfully:", result);
      setQuizzes((prev) => [...prev, rowData]);
      return result;
    } catch (error) {
      console.error("Error calling insert API:", error);
      alert("Quiz insertion failed!");
      throw error;
    }
  };

  const handleAddAssignment = async () => {
    // const id = new Date().getTime();
    // Fetch the current date
    const currentDate = new Date(); // Current date and time
    // Calculate dueDate as 14 days from currentDate
    const dDate = new Date(currentDate);
    dDate.setDate(dDate.getDate() + 14); // Add 14 days to startDate

    const startDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const dueDate = dDate.toISOString().split("T")[0]; // YYYY-MM-DD

    console.log("Start Date:", startDate);
    console.log("Due Date:", dueDate);

    const newRow = {
      ...newAssignment,
      startDate,
      dueDate,
      completionScore: 0,
      qualityScore: 0,
      compilationScore: 0,
      totalScore: 0,
    };
    // Make the API call
    try {
      const response = await fetch("/api/azureTableAssignmentInsertion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      });

      // Check the response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add assignment:", errorData);
        alert(`Error: ${errorData.message || "Failed to add assignment"}`);
      } else {
        const responseData = await response.json();
        console.log("Assignment added successfully:", responseData);
        alert("Assignment added successfully!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while adding the assignment.");
    }

    setTablesData((prev) => ({
      teamA: [...prev.teamA, newRow],
      teamB: [...prev.teamB, newRow],
      teamC: [...prev.teamC, newRow],
    }));

    setAddModalOpen(false);
    setNewAssignment({
      title: "",
      description: "",
    });
  };

  const quizToGrade = (quizRowKey) => {
    setGradeQuiz({
      rKey: quizRowKey,
      airForce1: 0,
      technoManiaks: 0,
      azureAscendants: 0
    });
  };

  const assignmentToGrade = (tableName, title, team) => {
    setGradeAssignment({
      table: tableName,
      team,
      assignmentTitle: title,
      completionScore: 0,
      qualityScore: 0,
      compilationScore: 0,
      totalScore: 0,
    });
  };

  const handleGradeQuiz = async () => {
    try {
      const response = await fetch("/api/gradeQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          gradeQuiz
      ),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setQuizzes((prevData) =>
        prevData.map((item) =>
          item.rowKey === gradeQuiz.rKey
            ? {
                ...item,
                airForce1: gradeQuiz.airForce1,
                technoManiaks: gradeQuiz.technoManiaks,
                azureAscendants: gradeQuiz.azureAscendants,
              }
            : item
        )
      );
      console.log("Quiz graded successfully:", result);
    } catch (error) {
      console.error("Error grading quiz:", error);
    } finally {
      setQuizModalOpen(false);
      setGradeQuiz({
        rKey: '',
        airForce1: 0,
        technoManiaks: 0,
        azureAscendants: 0
      });
    }
  };

  const handleGradeAssignment = async () => {
    console.log(gradeAssignment.table);
    console.log(gradeAssignment.team);
    console.log(gradeAssignment.assignmentTitle);

    const team = gradeAssignment.team;
    const totalScore =
      gradeAssignment.completionScore +
      gradeAssignment.compilationScore +
      gradeAssignment.qualityScore;

    try {
      const response = await fetch("/api/gradeAssignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: gradeAssignment.table,
          assignmentTitle: gradeAssignment.assignmentTitle,
          completionScore: gradeAssignment.completionScore,
          compilationScore: gradeAssignment.compilationScore,
          qualityScore: gradeAssignment.qualityScore,
          totalScore,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setTablesData((prevData) => ({
        ...prevData,
        [team]: prevData[team].map((item) =>
          item.title === gradeAssignment.assignmentTitle
            ? { ...item, totalScore }
            : item
        ),
      }));
      console.log("Assignment graded successfully:", result);
    } catch (error) {
      console.error("Error grading assignment:", error);
    } finally {
      setGradeModalOpen(false);
      setGradeAssignment({
        table: "",
        team: "",
        assignmentTitle: "",
        completionScore: 0,
        qualityScore: 0,
        compilationScore: 0,
        totalScore: 0,
      });
    }
  };

  const renderTeamGrid = (data, teamName, tableName, team, path) => (
    <Box mb={4}>
      <Typography variant="h5" mb={2}>
        {teamName}
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 5 }}
          onClick={() => router.push(path)} // Redirect to the provided path
        >
          View Assignments
        </Button>
      </Typography>
      <Grid container spacing={1}>
        {/* Table Header */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            style={{ padding: "10px", backgroundColor: "#f5f5f5" }}
          >
            <Grid container>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Assignment Title
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Description
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Start Date
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Due Date
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Score
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Table Rows */}
        {data.map((item) => (
          <Grid item xs={12} key={item.title}>
            <Paper elevation={1} style={{ padding: "10px" }}>
              <Grid container>
                <Grid item xs={2}>
                  <Typography variant="body1">{item.title}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ px: 3 }}>
                  <Typography variant="body2">{item.description}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{item.startDate}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{item.dueDate}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2">{item.totalScore}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setGradeModalOpen(true);
                      assignmentToGrade(tableName, item.title, team);
                    }}
                    disabled={currentUser.isAdmin}
                  >
                    Grade
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <>
    <Leaderboard quizzes={quizzes} tablesData={tablesData} />
      <Box mb={4}>
        <Typography variant="h4" mb={2}>
          <SiMicrosoftazure style={{ fontSize: "32px" }} />
          zure Quizzes
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleQuiz()}
            disabled={currentUser.isAdmin}
            style={{ margin: "30px", marginLeft: "900px" }}
          >
            Add Quiz
          </Button>
        </Typography>

        <Grid container spacing={1}>
          {/* Table Header */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              style={{ padding: "10px", backgroundColor: "#f5f5f5" }}
            >
              <Grid container>
                <Grid item xs={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Quiz Title
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Air Force 1
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Techno Maniaks
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Azure Ascendants
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                  ></Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Table Rows */}
          {quizzes.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={1} style={{ padding: "10px" }}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography variant="body1">{item.title}</Typography>
                  </Grid>

                  <Grid item xs={3} sx={{ px: 3 }}>
                    <Typography variant="body2">{item.airForce1}</Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ px: 3 }}>
                    <Typography variant="body2">
                      {item.technoManiaks}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ px: 3 }}>
                    <Typography variant="body2">
                      {item.azureAscendants}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setQuizModalOpen(true);
                        quizToGrade(item.rowKey);
                      }}
                      disabled={currentUser.isAdmin}
                    >
                      Grade Quiz
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h4" mb={2}>
        <SiMicrosoftazure style={{ fontSize: "32px" }} />
        zure <SiMicrosoftazure style={{ fontSize: "32px" }} />
        ssignments
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddModalOpen(true)}
          disabled={currentUser.isAdmin}
          style={{ margin: "30px", marginLeft: "800px" }}
        >
          Add Assignment
        </Button>
      </Typography>
      <Box p={3}>
        {renderTeamGrid(
          tablesData.teamA,
          "Team 1: Air Force 1 ( Akshay, Ardeshan, Chetanya, Tikaram )",
          "AirForce1",
          "teamA",
          "air-force-1"
        )}
        {renderTeamGrid(
          tablesData.teamB,
          "Team 2: Techno Maniaks ( Shaiz, Akanksha, Siddharth )",
          "TechnoManiaks",
          "teamB",
          "techno-maniaks"
        )}
        {renderTeamGrid(
          tablesData.teamC,
          "Team 3: Azure Ascendants ( Abhishek, Joham, Vighnesh )",
          "AzureAscendants",
          "teamC",
          "azure-ascendants"
        )}
      </Box>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            margin: "50px auto",
            //             width: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "20px" }}>
            Add New Assignment
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline // Enables textarea functionality
            rows={4} // Number of rows for the textarea
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                description: e.target.value,
              })
            }
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAssignment}
            fullWidth
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Modal open={gradeModalOpen} onClose={() => setGradeModalOpen(false)}>
        <Box
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            margin: "50px auto",
            width: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "20px" }}>
            Grade Assignment
          </Typography>
          <TextField
            label="Completion score"
            type="number"
            fullWidth
            value={gradeAssignment.completionScore}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeAssignment({
                ...gradeAssignment,
                completionScore: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <TextField
            label="Quality score"
            type="number"
            fullWidth
            value={gradeAssignment.qualityScore}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeAssignment({
                ...gradeAssignment,
                qualityScore: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <TextField
            label="Compilation score"
            type="number"
            fullWidth
            value={gradeAssignment.compilationScore}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeAssignment({
                ...gradeAssignment,
                compilationScore: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGradeAssignment}
            fullWidth
          >
            Grade
          </Button>
        </Box>
      </Modal>

      <Modal open={quizModalOpen} onClose={() => setQuizModalOpen(false)}>
        <Box
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            margin: "50px auto",
            width: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "20px" }}>
            Grade Quiz
          </Typography>
          <TextField
            label="Grade Air Force 1"
            type="number"
            fullWidth
            value={gradeQuiz.airForce1}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeQuiz({
                ...gradeQuiz,
                airForce1: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <TextField
            label="Grade Techno Maniaks"
            type="number"
            fullWidth
            value={gradeQuiz.technoManiaks}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeQuiz({
                ...gradeQuiz,
                technoManiaks: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <TextField
            label="Grade Azure Ascendants"
            type="number"
            fullWidth
            value={gradeQuiz.azureAscendants}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGradeQuiz({
                ...gradeQuiz,
                azureAscendants: isNaN(value) ? "" : value,
              });
            }}
            style={{ marginBottom: "10px" }}
            inputProps={{ min: 0 }} // Optional: restrict to positive integers
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGradeQuiz}
            fullWidth
          >
            Grade
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AzureGrids;
