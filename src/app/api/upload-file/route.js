// api/upload-file/route.js

import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req) {
  console.log("API Endpoint Hit: /api/upload-file");

  const url = new URL(req.url);
  const containerName = url.searchParams.get("containerName");

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
    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type");
    const parentFolder = formData.get("parentFolder");
    console.log(type);

    if (!file || !type || !parentFolder) {
      return new Response(
        JSON.stringify({ error: "Missing required form data (file, type, or parentFolder)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const blobName = `${parentFolder}/${type}/${file.name}`;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      console.error(`Container ${containerName} does not exist.`);
      return new Response(
        JSON.stringify({ error: `Container ${containerName} does not exist.` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file
    const arrayBuffer = await file.arrayBuffer();
    await blockBlobClient.uploadData(arrayBuffer, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    const blobUrl = blockBlobClient.url;

    console.log(`File uploaded successfully: ${blobUrl}`);
    return new Response(
      JSON.stringify({ message: "File uploaded successfully.", url: blobUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to upload file." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
