import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const blobName = "Task_Sheet_Updated.xlsx";

    if (!accountName || !accountKey || !containerName) {
      console.error("Missing required environment variables.");
      return new Response(
        JSON.stringify({ error: "Missing environment variables." }),
        { status: 500 }
      );
    }

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(accountName, accountKey)
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download(0);
    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const sheetData = [];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let row = range.s.r; row <= range.e.r; row++) {
      const rowData = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        rowData.push({
          address: cellAddress,
          value: cell ? cell.v : "" // If cell is empty, use an empty string
        });
      }
      sheetData.push(rowData);
    }

    return new Response(
      JSON.stringify({ sheetData }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}

async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}



// import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
// import * as XLSX from 'xlsx';

// export async function GET() {
//   try {
//     const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
//     const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
//     const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
//     const blobName = 'Task_Sheet_Updated.xlsx';

//     if (!accountName || !accountKey || !containerName) {
//       console.error('Missing required environment variables.');
//       return new Response(JSON.stringify({ error: 'Missing environment variables.' }), { status: 500 });
//     }

//     const blobServiceClient = new BlobServiceClient(
//       `https://${accountName}.blob.core.windows.net`,
//       new StorageSharedKeyCredential(accountName, accountKey)
//     );

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blobClient = containerClient.getBlobClient(blobName);

//     const downloadBlockBlobResponse = await blobClient.download(0);
//     const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
//     const workbook = XLSX.read(buffer, { type: 'buffer' });

//     console.log('Workbook sheet names:', workbook.SheetNames);

//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     console.log('Fetched sheet data:', sheetData);

//     return new Response(JSON.stringify(sheetData), { status: 200 });
//   } catch (error) {
//     console.error('Internal server error:', error);
//     return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
//   }
// }

// async function streamToBuffer(readableStream) {
//   const chunks = [];
//   for await (const chunk of readableStream) {
//     chunks.push(chunk);
//   }
//   return Buffer.concat(chunks);
// }
