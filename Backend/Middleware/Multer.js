import multer from "multer";
import fs from "fs";

// 1. Automatically create the directory if it doesn't exist (Fixes ENOENT)
const uploadDir = "./Public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Replace spaces with hyphens to prevent path reading errors
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    const uniqueName = Date.now() + "-" + sanitizedName;
    cb(null, uniqueName);
  },
});

// 2. Add a File Filter to only accept images
const fileFilter = (req, file, cb) => {
  // Check if the file's mimetype starts with 'image/' (e.g., image/jpeg, image/png)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject the file
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Optional: Limit file size to 5MB to prevent server overload
  }
});