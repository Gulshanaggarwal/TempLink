import mongoose from "mongoose";

const tempLinksSchema = new mongoose.Schema({
    expiry:{
        time: Number,
        selectedOption: String
    },
    password:{
        protection: Boolean,
        value: String
    },

    files: [{
        signedURL: String,
        fileName: String,
        fileType: String,
        size: Number
    }]
},{timestamps:true});


export default mongoose.models.TempLinks || mongoose.model('TempLinks',tempLinksSchema);