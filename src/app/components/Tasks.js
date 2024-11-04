"use client";
import { useEffect, useState } from "react";

export default function Tasks({ currentUser }) {
  const [data, setData] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    async function fetchExcelData() {
      const response = await fetch("/api/getExcel");
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
    if (!currentUser?.isAdmin) return; // Disable for non-admins
    const newRow = [
      { address: `A${data.length + 1}`, value: taskName },
      { address: `B${data.length + 1}`, value: "_" },
      { address: `C${data.length + 1}`, value: 0 },
      { address: `D${data.length + 1}`, value: "_" },
      { address: `E${data.length + 1}`, value: 0 },
      { address: `F${data.length + 1}`, value: "_" },
      { address: `G${data.length + 1}`, value: 0 },
      { address: `H${data.length + 1}`, value: "_" },
      { address: `I${data.length + 1}`, value: 0 }
    ];
    setData((prevData) => [...prevData, newRow]);

    const response = await fetch('/api/addRowToExcel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskName })
    });

    if (response.ok) {
      console.log('Row added successfully');
    } else {
      console.error('Failed to add row');
    }
  };

  const handleInputChange = (rowIndex, cellIndex, value) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex][cellIndex].value = value;
      return newData;
    });
  };

  return (
    <div>
      {/* Conditionally render the Add Row button if currentUser exists */}
      {currentUser && (
        <>
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button onClick={addRow} disabled={!currentUser.isAdmin}>
            Add Task
          </button>
        </>
      )}
      <hr />
      <table border="1">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cell.address} id={cell.address}>
                  <input
                    type="text"
                    value={cell.value}
                    onChange={(e) =>
                      handleInputChange(rowIndex, cellIndex, e.target.value)
                    }
                    disabled={
                      !currentUser ||
                      (!currentUser.isAdmin && cellIndex % 2 !== 0)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// // components/Tasks.js
// "use client";
// import { useEffect, useState } from "react";

// export default function Tasks({ currentUser }) {
//   const [data, setData] = useState([]);
//   const [taskName, setTaskName] = useState("");

//   useEffect(() => {
//     async function fetchExcelData() {
//       const response = await fetch("/api/getExcel");
//       if (!response.ok) {
//         console.error("Error fetching data:", response.statusText);
//         return;
//       }

//       try {
//         const excelData = await response.json();
//         setData(excelData.sheetData);
//       } catch (error) {
//         console.error("Failed to parse JSON:", error);
//       }
//     }

//     fetchExcelData();
//   }, []);

//   const addRow = async () => {
//     if (!currentUser?.isAdmin) return; // Disable for non-admins
//     const newRow = [taskName, "_", 0, "_", 0, "_", 0, "_", 0];
//     setData((prevData) => [...prevData, newRow]);

//     const response = await fetch('/api/addRowToExcel', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ taskName })
//     });

//     if (response.ok) {
//       console.log('Row added successfully');
//     } else {
//       console.error('Failed to add row');
//     }
//   };

//   return (
//     <div>
//       {/* Conditionally render the Add Row button if currentUser exists */}
//       {currentUser && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter task name"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//           />
//           <button onClick={addRow} disabled={!currentUser.isAdmin}>
//             Add Task
//           </button>
//         </>
//       )}
//       <hr />
// <table border="1">
// <tbody>
//   {data.map((row, rowIndex) => (
//     <tr key={rowIndex}>
//       {row.map((cell, i) => (
//         <td key={cell.address} id={cell.address}>
//           {cell.value}
//         </td>
//       ))}
//     </tr>
//   ))}
// </tbody>
// </table>
//     </div>
//   );
// }
