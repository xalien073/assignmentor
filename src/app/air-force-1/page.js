  // air-force-1/page.js
"use client";

import AssignmentViewer from "../components/AssignmentViewer";

export default function AirForce1() {

  return (
    <div>
      <h1>Air Force 1</h1>
      
      <AssignmentViewer
      containerName="airforce1"
      tableName="AirForce1"
      team={['akshay@gmail.com', 'ardeshan@gmail.com', 'chet@gmail.com', 'tika@gmail.com']}
      />
      
    </div>
  );
}
