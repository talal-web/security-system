// utils/uploadToCloudinary.js

import cloudinary from "../infrastructure/config/cloudinary.js";
import streamifier from "streamifier";
import logger from "../infrastructure/config/logger.js";
import ApiError from "./ApiError.js";

const UPLOAD_TIMEOUT_MS = 60 * 1000;

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    // Cloudinary errors (timeouts, network, rate limits) are external, so
    // report them as 502 instead of an unexplained 500.
    const fail = (cause) => {
      logger.error({
        message: "Cloudinary upload failed",
        error: cause?.message || String(cause),
        http_code: cause?.http_code,
        timestamp: new Date().toISOString(),
      });

      finish(
        reject,
        new ApiError(502, "Image upload failed. Please try again."),
      );
    };

    const timer = setTimeout(
      () => fail(new Error("Cloudinary upload timed out")),
      UPLOAD_TIMEOUT_MS,
    );

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "employees",
      },
      (error, result) => {
        if (result) finish(resolve, result);
        else fail(error);
      },
    );

    streamifier.createReadStream(fileBuffer).on("error", fail).pipe(stream);
  });
};

export default uploadToCloudinary;
