
// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"



// cloudinary.config({ 
//   cloud_name: process.env.cloud_name, 
//   api_key: process.env.api_key, 
//   api_secret: process.env.api_secret
// });





// const uploadOnCloudinary =async (LocalFilePath)=>{

//     try{
// if(!LocalFilePath){
//     return null
// }
// else{
//     const cloudinaryUrl=await cloudinary.uploader.upload(LocalFilePath,{
//         resource_type:"auto",
//     })
//     console.log("File is Uploded Sucessfully",cloudinaryUrl.url)
//       fs.unlinkSync(LocalFilePath)

//     return cloudinaryUrl
// }
//     }catch(error){
// if (LocalFilePath && fs.existsSync(LocalFilePath)) {
//        fs.unlinkSync(LocalFilePath)
//     }

//     console.error("Cloudinary upload error:", error)
//     return null
//     }

// }


// export {uploadOnCloudinary }







import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary error:", error);
    return null;
  }
};

export { uploadOnCloudinary };