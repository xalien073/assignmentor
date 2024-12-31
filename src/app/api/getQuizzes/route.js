// api/getQuizzes/route.js

import { TableClient } from "@azure/data-tables";

export async function GET(req) {
  console.log("API Endpoint Hit: /api/getQuizzes");

  const url = new URL(req.url);
  const timestamp = url.searchParams.get("timestamp");

  if (!timestamp) {
    console.error("Missing timestamp parameter.");
    return new Response(
      JSON.stringify({ error: "Missing timestamp parameter." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const tableName = "assignmentorQuizzes";

  if (!connectionString) {
    console.error("Azure Storage connection string is not configured.");
    return new Response(
      JSON.stringify({ error: "Azure Storage connection string is not configured." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }

  try {
    const client = TableClient.fromConnectionString(connectionString, tableName);
    const tableData = [];

    for await (const entity of client.listEntities()) {
      tableData.push(entity);
    }

    // Set headers to prevent caching
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log(`Quizzes data fetched for table: ${tableName} at timestamp: ${timestamp}`);
    console.log(tableData);
    return new Response(JSON.stringify({ data: tableData }), { status: 200, headers });
  } catch (error) {
    console.error(`Error fetching data from table ${tableName}:`, error.message);
    return new Response(
      JSON.stringify({ error: `Failed to fetch data from table ${tableName}.` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
