import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const extension = file.originalname.split(".").pop().toLowerCase();
  const hasAllowedExtension = allowedTypes.test(extension);
  const hasAllowedMimeType = allowedTypes.test(file.mimetype);

  if (hasAllowedExtension && hasAllowedMimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default upload;
