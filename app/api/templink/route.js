import { NextResponse } from "next/server";
import { pinata } from "@/app/utils/PinataConfig";
import dbConnect from "@/app/utils/DbConnect";
import TempLinks from "@/app/models/TempLinks";
import { comparePassword, hashPassword } from "@/app/utils/utils";

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
      const expiryTime = settingsData.expiryTime.time; // in milliseconds
      const expiresIn = Math.floor(expiryTime / 1000); // convert to seconds
      const selectedExpiryOption = settingsData.expiryTime.selectedOption;
      const isPasswordEnabled = settingsData.password.passwordProtection;
      const passwordValue = settingsData.password.passwordValue;
  
      const uploadPromises = files.map(async (file) => {

        const uploadData = await pinata.upload.file(file);

        const signedUrlfuncObjToPass ={
            cid: uploadData.cid,
            expires: expiresIn,
        }

        // if the expiry time is set to never, then we don't need to send the expires key
        if(selectedExpiryOption === "NEVER"){
            delete signedUrlfuncObj.expires;
        }
  
        const signedURL = await pinata.gateways.createSignedURL(signedUrlfuncObjToPass);
  
        return {
          signedURL,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
        };
      });
  
      const uploadResponse = await Promise.all(uploadPromises);

      const dbSaveObj = {
        expiry: {
            time: expiryTime,
            selectedOption: selectedExpiryOption
        },
        password: {
            protection: false,
            value: '',
        },
        files: uploadResponse,
      }


      if(isPasswordEnabled){
        if(!passwordValue){
            return NextResponse.json({status: 400, error: 'Password is required'});
        }

        dbSaveObj.password.protection = true;
        dbSaveObj.password.value = hashPassword(passwordValue);
      }

      const dbResponse = await TempLinks.create(dbSaveObj);
      
      return NextResponse.json({
        status: 200,
        message: "Created Successfully",
        id: dbResponse._id.toString(),
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
      const password = searchParams.get('password');
  
      if (!id) {
        return NextResponse.json(
          { error: 'ID query parameter is required' },
          { status: 400 }
        );
      }
  
      const response = await TempLinks.findById(id).lean();

      if (!response) {
        return NextResponse.json(
          { error: 'NO_RECORD_FOUND' },
          { status: 404 }
        );
      }

      const expiryTime = response.expiry.time;
      const isPasswordEnabled = response.password.protection;
      const hashedPassword = response.password.value;

      const currentTime = new Date().getTime();
      const isExpired = response.expiry.selectedOption !== "NEVER" && expiryTime < currentTime;

      if(isExpired){
        return NextResponse.json({status: 404, error: 'LINK_EXPIRED'});
      }

      if(isPasswordEnabled && !password){
        return NextResponse.json({status: 401, error: 'PASSWORD_REQUIRED'});
      }

      if(isPasswordEnabled){
        const isPasswordMatch = await comparePassword(password, hashedPassword);
        if(!isPasswordMatch){
          return NextResponse.json({status: 401, error: 'PASSWORD_INCORRECT'});
        }
      }
  
      return NextResponse.json({status: 200, data: {files: response.files }});
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  
  