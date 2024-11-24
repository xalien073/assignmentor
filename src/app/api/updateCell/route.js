// /api/updateCell/route.js

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as XLSX from 'xlsx';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const blobName = process.env.FILE_NAME;

async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  try {
    const { rowIndex, cellIndex, value, cellAddress } = await req.json();

    // Initialize Blob Service Client
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(accountName, accountKey)
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Download the Excel file
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Update the specific cell in the worksheet
    worksheet[cellAddress] = { v: value };

    // Convert updated workbook back to a buffer
    const updatedBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Upload the updated file back to Blob Storage
    await blockBlobClient.upload(updatedBuffer, updatedBuffer.length, { overwrite: true });

    return new Response(JSON.stringify({ message: 'Cell updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Failed to update cell:', error);
    return new Response(JSON.stringify({ error: 'Failed to update cell' }), { status: 500 });
  }
}
