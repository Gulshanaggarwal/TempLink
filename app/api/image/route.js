import dbConnect from "@/app/utils/DbConnect";
import { NextResponse } from "next/server";
import fetch from "node-fetch";
import TempLinks from "@/app/models/TempLinks";


export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tempLinkId = searchParams.get('tempLinkId');
    const imageId = searchParams.get('imageId');
    const type = searchParams.get('type');

    if (!tempLinkId || !imageId || !type) {
      return NextResponse.json(
        { error: 'PARAMS_REQUIRED' },
        { status: 400 }
      );
    }

    const response = await TempLinks.findById(tempLinkId).select('files').lean();
    if (!response) {
      return NextResponse.json(
        { error: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    let files = [];
    if (imageId) {
      files = response.files.filter((file) => file._id == imageId);
    } else if (type == 'all') {
      files = response.files;
    }

    const filesGetPromises = files.map(async (file) => {
      try {
        const response = await fetch(file.signedURL);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file.fileName}`);
        }

        const buffer = await response.buffer();

        return {
          fileName: file.fileName,
          buffer: buffer.toString('base64'), // Encode the buffer to base64
          contentType: response.headers.get('content-type'), // Send content type
        };
      } catch (error) {
        console.error('Error: in filesGetPromises fn', error);
        return null;
      }
    });

    const filesData = await Promise.all(filesGetPromises);

    // Send the files data to the frontend
    return NextResponse.json({
      files: filesData.filter((file) => file !== null), // Filter out failed fetches
    });

  } catch (error) {
    console.error('Error fetching image data', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
