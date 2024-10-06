import { NextResponse } from "next/server";
import { pinata } from "@/app/utils/PinataConfig";
import dbConnect from "@/app/utils/DbConnect";
import TempLinks from "@/app/models/TempLinks";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
    try {
    
      await dbConnect();  
      const data = await request.formData();
      const files = data.getAll("files");
      const settingsData = JSON.parse(data.get("settings"));
      const expiresIn = settingsData.expiryTime.time / 1000;
  
      const uploadPromises = files.map(async (file) => {
        const uploadData = await pinata.upload.file(file);
  
        const signedURL = await pinata.gateways.createSignedURL({
          cid: uploadData.cid,
          expires: expiresIn,
        });
  
        return {
          signedURL,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
        };
      });
  
      const uploadResponse = await Promise.all(uploadPromises);
      const dbResponse = await TempLinks.create({
        expiry: {
            time: settingsData.expiryTime.time,
            selectedOption: settingsData.expiryTime.selectedOption,
        },
        password: {
            protection: settingsData.password.passwordProtection,
            value: settingsData.password.passwordValue,
        },
        files: uploadResponse,
      });


      
      return NextResponse.json({
        status: 200,
        message: "Created Successfully",
        tempLinkId: dbResponse._id.toString(),
      });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
}

export async function GET(request) {
    try {
      await dbConnect();
  
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json(
          { error: 'ID query parameter is required' },
          { status: 400 }
        );
      }
  
      const response = await TempLinks.findById(id)
        .select('expiry password.protection files')
        .lean();
  
      if (!response) {
        return NextResponse.json(
          { error: 'No record found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(response);
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  
  