// app/components/Tasks.js
"use client";
import { useEffect, useState } from "react";
import { AiOutlineDownload, AiOutlinePlus } from "react-icons/ai"; // Icons for download and add/plus

export default function Tasks({ currentUser }) {
  const [data, setData] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchExcelData() {
      const timestamp = new Date().getTime(); // Add timestamp to prevent caching
      const response = await fetch(`/api/getExcel?timestamp=${timestamp}`);
      if (!response.ok) {
        console.error("Error fetching data:", response.statusText);
        return;
      }
      try {
        const excelData = await response.json();
        setData(excelData.sheetData);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    }

    fetchExcelData();
  }, []);

  const addRow = async () => {
    if (!currentUser?.isAdmin) return;
    const newRow = [
      { address: `A${data.length + 1}`, value: taskName },
      { address: `B${data.length + 1}`, value: " " },
      { address: `C${data.length + 1}`, value: 0 },
      { address: `D${data.length + 1}`, value: " " },
      { address: `E${data.length + 1}`, value: 0 },
      { address: `F${data.length + 1}`, value: " " },
      { address: `G${data.length + 1}`, value: 0 },
      { address: `H${data.length + 1}`, value: " " },
      { address: `I${data.length + 1}`, value: 0 },
      { address: `J${data.length + 1}`, value: " " },
      { address: `K${data.length + 1}`, value: 0 },
      { address: `L${data.length + 1}`, value: " " },
      { address: `M${data.length + 1}`, value: 0 },
      { address: `N${data.length + 1}`, value: " " },
      { address: `O${data.length + 1}`, value: 0 },
      { address: `P${data.length + 1}`, value: " " },
      { address: `Q${data.length + 1}`, value: 0 },
      { address: `R${data.length + 1}`, value: " " },
      { address: `S${data.length + 1}`, value: 0 },
      { address: `T${data.length + 1}`, value: " " },
      { address: `U${data.length + 1}`, value: 0 },
      { address: `V${data.length + 1}`, value: " " },
      { address: `W${data.length + 1}`, value: 0 },
      { address: `X${data.length + 1}`, value: " " },
      { address: `Y ${data.length + 1}`, value: 0 },
    ];
    setData((prevData) => [...prevData, newRow]);

    const response = await fetch("/api/addRowToExcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskName }),
    });

    if (response.ok) {
      console.log("Row added successfully");
    } else {
      console.error("Failed to add row");
      alert("Error adding row");
    }
    setTaskName("");
  };

  const handleInputChange = (rowIndex, cellIndex, newStatus) => {
    setData((prevData) => {
      const newData = [...prevData];
      if (cellIndex % 2 === 0 && cellIndex !== 0) {
        newData[rowIndex][cellIndex].value = parseInt(newStatus) || 0;
        let sum = 0;
        for (let i = 2; i < newData.length; i++) {
          sum += parseInt(newData[i][cellIndex].value) || 0;
        }
        newData[1][cellIndex].value = sum;
      } else {
        newData[rowIndex][cellIndex].value = newStatus;
      }

      return newData;
    });
  };

  const handleUpdateClick = async (rowIndex, cellIndex) => {
    try {
      const cellAddress = data[rowIndex][cellIndex].address;
      const response = await fetch("/api/updateCell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rowIndex,
          cellIndex,
          value: data[rowIndex][cellIndex].value,
          cellAddress,
        }),
      });

      if (response.ok) {
        console.log("Cell updated successfully!");
      } else {
        console.error("Failed to update cell");
        alert("Error updating cell!");
      }
    } catch (error) {
      console.error("Error updating cell:", error);
      alert("Error updating cell!");
    }
    if (cellIndex % 2 === 0 && cellIndex != 0) {
      try {
        const cellAddress = data[1][cellIndex].address;
        const response = await fetch("/api/updateCell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rowIndex: 1,
            cellIndex,
            value: data[1][cellIndex].value,
            cellAddress,
          }),
        });

        if (response.ok) {
          console.log("Cell total updated successfully!");
        } else {
          console.error("Failed to update cell");
        }
      } catch (error) {
        console.error("Error updating cell:", error);
      }
    }
  };

  const handleDownload = async () => {
    setLoading(true);

    try {
      const timestamp = new Date().getTime(); // Add timestamp to prevent caching
      const response = await fetch(`/api/getReport?timestamp=${timestamp}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download blob");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const currentDate = new Date().toISOString().split("T")[0];
      a.download = `assignments_report_${currentDate}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {currentUser && (
        <div style={{ margin: "20px" }}>
          <input
            type="text"
            placeholder="Enter assignment name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={!currentUser.isAdmin}
            style={{
              padding: "0.5em 0.5em",
              border: "none",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={addRow}
            disabled={!currentUser.isAdmin}
            style={{
              marginLeft: "1em",
              padding: "0.5em 0.5em",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Assignment <AiOutlinePlus size={13} color="#fff" title="Add" />
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{
              marginLeft: "30px",
              padding: "0.5em 0.5em",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Downloading..." : "Download Report"}{" "}
            <AiOutlineDownload size={13} color="#fff" title="Download" />
          </button>
        </div>
      )}
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table border="1">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isAdminAndEvenColumn =
                    currentUser?.isAdmin && cellIndex % 2 === 0;
                  const renderInput =
                    rowIndex >= 2 &&
                    (currentUser?.col === cell.address[0] ||
                      isAdminAndEvenColumn);

                  return (
                    <td key={cell.address} id={cell.address}>
                      {renderInput ? (
                        <>
                          <input
                            type="text"
                            value={cell.value}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                cellIndex,
                                e.target.value
                              )
                            }
                            style={{
                              padding: "0.5em 1em",
                            }}
                          />
                          <button
                            onClick={() =>
                              handleUpdateClick(rowIndex, cellIndex)
                            }
                            style={{
                              padding: "0.5em 1em",
                              backgroundColor: "#0070f3",
                              color: "#fff",
                              border: "none",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                          >
                            Update
                          </button>
                        </>
                      ) : (
                        <p
                          style={{
                            padding: "0.5em",
                          }}
                        >
                          {cell.value}
                        </p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
