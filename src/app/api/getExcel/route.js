// app/api/getExcel/route.js

import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as XLSX from "xlsx";

export async function GET(request) {
  try {
    // Retrieve the timestamp from the request URL to prevent caching
    const url = new URL(request.url);
    const timestamp = url.searchParams.get("timestamp"); // Get timestamp query param
    if (!timestamp) {
      console.error("Missing timestamp parameter.");
      return new Response(
        JSON.stringify({ error: "Missing timestamp parameter." }),
        { status: 400 }
      );
    }

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const blobName = process.env.FILE_NAME;

    // Validate required environment variables
    if (!accountName || !accountKey || !containerName || !blobName) {
      console.error("Missing required environment variables.");
      return new Response(
        JSON.stringify({ error: "Missing environment variables." }),
        { status: 500 }
      );
    }

    // Initialize Azure Blob Service Client
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(accountName, accountKey)
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Download blob data
    const downloadBlockBlobResponse = await blobClient.download(0);
    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Extract data from the worksheet
    const sheetData = [];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Iterate through rows and columns of the Excel sheet to build sheetData
    for (let row = range.s.r; row <= range.e.r; row++) {
      const rowData = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        rowData.push({
          address: cellAddress,
          value: cell ? cell.v : "" // Use empty string if cell is empty
        });
      }
      sheetData.push(rowData);
    }

    // Set response headers to prevent caching
    const headers = new Headers();
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate"); // Prevent caching
    headers.set("Pragma", "no-cache"); // For HTTP/1.0 caches
    headers.set("Expires", "0"); // Set expiration to 0 for older browsers
    
    console.log(`got excel at ${timestamp}`);
    // Send response with sheet data and prevent caching
    return new Response(
      JSON.stringify({ sheetData }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// src/app/api/getExcel/route.js

// import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
// import * as XLSX from "xlsx";

// export async function GET() {
//   try {
//     const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
//     const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
//     const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
//     const blobName = process.env.FILE_NAME;
    
//     if (!accountName || !accountKey || !containerName) {
//       console.error("Missing required environment variables.");
//       return new Response(
//         JSON.stringify({ error: "Missing environment variables." }),
//         { status: 500 }
//       );
//     }

//     const blobServiceClient = new BlobServiceClient(
//       `https://${accountName}.blob.core.windows.net`,
//       new StorageSharedKeyCredential(accountName, accountKey)
//     );

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blobClient = containerClient.getBlobClient(blobName);

//     const downloadBlockBlobResponse = await blobClient.download(0);
//     const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
//     const workbook = XLSX.read(buffer, { type: "buffer" });

//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const sheetData = [];
//     const range = XLSX.utils.decode_range(worksheet["!ref"]);

//     for (let row = range.s.r; row <= range.e.r; row++) {
//       const rowData = [];
//       for (let col = range.s.c; col <= range.e.c; col++) {
//         const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
//         const cell = worksheet[cellAddress];
//         rowData.push({
//           address: cellAddress,
//           value: cell ? cell.v : "" // If cell is empty, use an empty string
//         });
//       }
//       sheetData.push(rowData);
//     }

//     return new Response(
//       JSON.stringify({ sheetData }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal server error." }),
//       { status: 500 }
//     );
//   }
// }

// async function streamToBuffer(readableStream) {
//   const chunks = [];
//   for await (const chunk of readableStream) {
//     chunks.push(chunk);
//   }
//   return Buffer.concat(chunks);
// }
