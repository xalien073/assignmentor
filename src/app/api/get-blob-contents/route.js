// api/get-blob-contents/route.js

import { BlobServiceClient } from "@azure/storage-blob";

export async function GET(req) {
  console.log("API Endpoint Hit: /api/getBlobContents");

  const url = new URL(req.url);
  const timestamp = url.searchParams.get("timestamp");
  const containerName = url.searchParams.get("containerName");

  // Validate required query parameters
  if (!timestamp) {
    console.error("Missing timestamp parameter.");
    return new Response(
      JSON.stringify({ error: "Missing timestamp parameter." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!containerName) {
    console.error("Missing containerName parameter.");
    return new Response(
      JSON.stringify({ error: "Missing containerName parameter." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    console.error("Azure Storage connection string is not configured.");
    return new Response(
      JSON.stringify({ error: "Azure Storage connection string is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobs = [];

    // Iterate through all blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobUrl = `${containerClient.url}/${blob.name}`;
      blobs.push({ name: blob.name, url: blobUrl });
    }

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    console.log(
      `Blob contents fetched for container: ${containerName} at timestamp: ${timestamp}`
    );

    // Return the list of blobs with names and URLs
    return new Response(JSON.stringify(blobs), { status: 200, headers });
  } catch (error) {
    console.error(`Error fetching contents from container ${containerName}:`, error.message);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch contents from container ${containerName}.`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
