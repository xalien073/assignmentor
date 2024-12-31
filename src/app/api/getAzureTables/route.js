// api/getAzureTables/route.js

import { TableClient } from "@azure/data-tables";

export async function GET(req) {
  console.log("API Endpoint Hit: /api/getAzureTables");

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

  const tableNames = ["AirForce1", "TechnoManiaks", "AzureAscendants"];

  try {
    const results = await Promise.all(
      tableNames.map(async (tableName) => {
        const client = TableClient.fromConnectionString(connectionString, tableName);
        const tableData = [];

        for await (const entity of client.listEntities()) {
          tableData.push(entity);
        }

        return { tableName, data: tableData };
      })
    );

    const formattedResults = results.reduce((acc, { tableName, data }) => {
      acc[tableName] = data;
      return acc;
    }, {});

    // Set headers to prevent caching
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log(`Azure Tables data fetched at timestamp: ${timestamp}`);
    return new Response(JSON.stringify(formattedResults), { status: 200, headers });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data from Azure Table Storage." }),
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

