// components/Leaderboard.js

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const Leaderboard = ({ quizzes, tablesData }) => {
  // Function to calculate team scores
  const calculateLeaderboard = () => {
    const teamScores = [
      {
        team: "Air Force 1",
        score:
          tablesData.teamA.reduce((acc, obj) => acc + obj.totalScore, 0) +
          quizzes.reduce((acc, quiz) => acc + (quiz.airForce1 || 0), 0),
      },
      {
        team: "Techno Maniaks",
        score:
          tablesData.teamB.reduce((acc, obj) => acc + obj.totalScore, 0) +
          quizzes.reduce((acc, quiz) => acc + (quiz.technoManiaks || 0), 0),
      },
      {
        team: "Azure Ascendants",
        score:
          tablesData.teamC.reduce((acc, obj) => acc + obj.totalScore, 0) +
          quizzes.reduce((acc, quiz) => acc + (quiz.azureAscendants || 0), 0),
      },
    ];

    // Sort teams by total score in descending order
    return teamScores.sort((a, b) => b.score - a.score);
  };

  const leaderboard = calculateLeaderboard();

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" align="center" gutterBottom>
        Leaderboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow
          style={{ backgroundColor: 'purple' }}
          >
            <TableCell align="center">
              <strong>Rank</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Team</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Total Score</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((team, index) => {
            const backgroundColors = ["#0000FF", "#5F9EA0", "#ADD8E6"]; // Define shades of blue
            return (
              <TableRow
                key={team.team}
                style={{ backgroundColor: backgroundColors[index] }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{team.team}</TableCell>
                <TableCell align="center">{team.score}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
