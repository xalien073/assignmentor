  // techno-maniaks/page.js
"use client";

import AssignmentViewer from "../components/AssignmentViewer";

export default function TechnoManiaks() {

  return (
    <div>
      <h1>Techno Maniaks</h1>

      <AssignmentViewer
                  containerName="technomaniaks"
                  tableName="TechnoManiaks"
                  team={['akan@gmail.com', 'shaiz@gmail.com', 'sid@gmail.com']}
                  />

    </div>
  );
}
