  // azure-ascendants/page.js
"use client";

import AssignmentViewer from "../components/AssignmentViewer";

export default function AzureAscendants() {

  return (
    <div>
      <h1>Azure Ascendants</h1>
      
      <AssignmentViewer
            containerName="azureascendants"
            tableName="AzureAscendants"
            team={['abhi@gmail.com', 'joha@gmail.com', 'itachi@gmail.com']}
            />
      
    </div>
  );
}
