// components/UpdateExcelForm.js

import { useState } from 'react';

const UpdateExcelForm = () => {
  const [cell, setCell] = useState('');
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/excel/updateSheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerName: process.env.NEXT_PUBLIC_CONTAINER_NAME,
          fileName: process.env.NEXT_PUBLIC_FILE_NAME,
          cell,
          newValue,
        }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error updating Excel file');
    }
  };

  return (
    <div>
      <h2>Update Excel Sheet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cell (e.g., A1)"
          value={cell}
          onChange={(e) => setCell(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateExcelForm;
