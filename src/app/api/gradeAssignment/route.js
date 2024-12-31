// api/gradeAssignment/route.js
import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export async function POST(req) {
  try {
    const rowData = await req.json(); // Parse JSON request body

    const { table, assignmentTitle, completionScore, qualityScore, compilationScore, totalScore } = rowData;

    // Validate required fields
    if (!table || !assignmentTitle) {
      return new Response(JSON.stringify({ message: "Missing required fields: table or assignmentTitle" }), { status: 400 });
    }

    if (completionScore == null && qualityScore == null && compilationScore == null && totalScore == null) {
      return new Response(JSON.stringify({ message: "No fields to update provided" }), { status: 400 });
    }

    // Update the entity in the specified table
    await updateEntityInAzureTable(table, assignmentTitle, { completionScore, qualityScore, compilationScore, totalScore });

    return new Response(JSON.stringify({ message: "Entity updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating entity:", error);
    return new Response(JSON.stringify({ message: "Error updating entity in table", error }), { status: 500 });
  }
}

async function updateEntityInAzureTable(tableName, assignmentTitle, updateData) {
  try {
    const client = TableClient.fromConnectionString(connectionString, tableName);

    // Retrieve the entity
    const entities = client.listEntities({ queryOptions: { filter: `PartitionKey eq 'assignments' and title eq '${assignmentTitle}'` } });

    let foundEntity = null;
    for await (const entity of entities) {
      foundEntity = entity;
      break;
    }

    if (!foundEntity) {
      throw new Error(`Entity with assignmentTitle '${assignmentTitle}' not found in table '${tableName}'`);
    }

    // Merge the updates (exclude `undefined` values)
    const updatedEntity = {
      ...foundEntity,
      ...Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      ),
    };

    // Update the entity in the table
    await client.updateEntity(updatedEntity, "Merge");
    console.log(`Entity updated in table ${tableName}`);
  } catch (error) {
    console.error(`Error updating entity in table ${tableName}:`, error);
    throw error;
  }
}
