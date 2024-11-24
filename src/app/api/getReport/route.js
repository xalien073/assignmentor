// src/app/api/getReport/route.js
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

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
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    // Initialize the BlobServiceClient to interact with Azure Blob Storage
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(accountName, accountKey)
    );

    // Get the container client and blob client for the requested blob
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Download the blob content
    const downloadBlockBlobResponse = await blobClient.download(0);
    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

    console.log(`got report at ${timestamp}!`);

    // Return the blob content with proper headers to prevent caching
    return new Response(buffer, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${blobName}"`,
        // Add timestamp to prevent caching, ensuring fresh data is fetched
        "X-Timestamp": timestamp,
      },
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

// Helper function to convert the stream to a buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// src/app/api/getReport/route.js

// import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

// //Named export for the GET method
// export async function GET() {
//   try {
//     const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
//     const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
//     const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
//     const blobName = process.env.FILE_NAME;

//     // Ensure required environment variables are set
//     if (!accountName || !accountKey || !containerName || !blobName) {
//       console.error("Missing required environment variables.");
//       return new Response(
//         JSON.stringify({ error: "Missing environment variables." }),
//         { status: 500 }
//       );
//     }

//     // Create the BlobServiceClient
//     const blobServiceClient = new BlobServiceClient(
//       `https://${accountName}.blob.core.windows.net`,
//       new StorageSharedKeyCredential(accountName, accountKey)
//     );

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blobClient = containerClient.getBlobClient(blobName);

//     // Download the blob content
//     const downloadBlockBlobResponse = await blobClient.download(0);
//     const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

//     // Create a new response that serves the Excel file directly
//     return new Response(buffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel MIME type
//         "Content-Disposition": `attachment; filename="${blobName}"`, // The file name that the user will see
//       },
//     });
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal server error." }),
//       { status: 500 }
//     );
//   }
// }

// // Helper function to convert the stream to a buffer
// async function streamToBuffer(readableStream) {
//   const chunks = [];
//   for await (const chunk of readableStream) {
//     chunks.push(chunk);
//   }
//   return Buffer.concat(chunks);
// }
