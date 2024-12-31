// api/getBlobImages/route.js
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const containerName = searchParams.get("containerName");

    if (!containerName) {
      return new Response(
        JSON.stringify({ message: "Container name is required" }),
        { status: 400 }
      );
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const blobUrl = `${containerClient.url}/${blob.name}`;
      imageUrls.push(blobUrl);
    }

    return new Response(JSON.stringify({ images: imageUrls }), { status: 200 });
  } catch (error) {
    console.error("Error fetching images from blob container:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching images", error }),
      { status: 500 }
    );
  }
}
