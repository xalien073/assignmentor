// api/azureTableQuizInsertion/route.js
import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE_NAME = "assignmentorQuizzes";

export async function POST(req) {
  try {
    const rowData = await req.json(); // Parse JSON request body
    
    await addRowToAzureTable(TABLE_NAME, rowData);

    return new Response(
      JSON.stringify({ message: "Row added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding row:", error);
    return new Response(
      JSON.stringify({ message: "Error adding row to table", error }),
      { status: 500 }
    );
  }
}

async function addRowToAzureTable(tableName, rowData) {
  try {
    const client = TableClient.fromConnectionString(connectionString, tableName);
    await client.createEntity(rowData);
    console.log(`Row added to table ${tableName}`);
  } catch (error) {
    console.error(`Error adding row to table ${tableName}:`, error);
    throw error;
  }
}
