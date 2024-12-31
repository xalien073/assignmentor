// api/azureTableAssignmentInsertion/route.js
import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE_NAMES = ["AirForce1", "AzureAscendants", "TechnoManiaks"];

export async function POST(req) {
  try {
    const rowData = await req.json(); // Parse JSON request body

    // Store the row in all specified tables
    const promises = TABLE_NAMES.map((tableName) =>
      addRowToAzureTable(tableName, rowData)
    );
    await Promise.all(promises);

    // Respond with success if all rows are added
    return new Response(
      JSON.stringify({ message: "Row added to all tables successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding rows:", error);
    return new Response(
      JSON.stringify({ message: "Error adding rows to tables", error }),
      { status: 500 }
    );
  }
}

async function addRowToAzureTable(tableName, rowData) {
  try {
    const client = TableClient.fromConnectionString(connectionString, tableName);

    const entity = {
      partitionKey: "assignments",
      rowKey: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      ...rowData,
    };

    await client.createEntity(entity);
    console.log(`Row added to table ${tableName}`);
  } catch (error) {
    console.error(`Error adding row to table ${tableName}:`, error);
    throw error;
  }
}

