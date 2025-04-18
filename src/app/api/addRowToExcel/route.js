// api/addRowToExcel/route.js

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
    const { taskName } = await req.json();
    console.log(taskName);
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
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const newRow = [taskName]//, " ", 0, " ", 0, " ", 0, "_", 0];
    data.push(newRow);

    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    const updatedBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Upload the updated file back to Blob Storage
    await blockBlobClient.upload(updatedBuffer, updatedBuffer.length, { overwrite: true });

    return new Response(JSON.stringify({ message: 'Row added successfully' }), { status: 200 });
  } catch (error) {
    console.error('Failed to add row:', error);
    return new Response(JSON.stringify({ error: 'Failed to add row' }), { status: 500 });
  }
}

