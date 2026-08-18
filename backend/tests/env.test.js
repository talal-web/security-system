import test from "node:test";
import assert from "node:assert/strict";
import { validateEnv } from "../src/config/env.js";

test("validateEnv rejects missing production config", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMongoUri = process.env.MONGO_URI;
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalFrontendUrls = process.env.FRONTEND_URLS;
  const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const originalApiKey = process.env.CLOUDINARY_API_KEY;
  const originalApiSecret = process.env.CLOUDINARY_API_SECRET;

  process.env.NODE_ENV = "production";
  process.env.MONGO_URI = "mongodb://localhost:27017/test";
  process.env.JWT_SECRET = "test-secret";
  delete process.env.FRONTEND_URLS;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  assert.throws(() => validateEnv(), {
    message:
      /Missing required environment variables.*FRONTEND_URLS.*CLOUDINARY_CLOUD_NAME.*CLOUDINARY_API_KEY.*CLOUDINARY_API_SECRET/,
  });

  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;

  if (originalMongoUri === undefined) delete process.env.MONGO_URI;
  else process.env.MONGO_URI = originalMongoUri;

  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;

  if (originalFrontendUrls === undefined) delete process.env.FRONTEND_URLS;
  else process.env.FRONTEND_URLS = originalFrontendUrls;

  if (originalCloudName === undefined) delete process.env.CLOUDINARY_CLOUD_NAME;
  else process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;

  if (originalApiKey === undefined) delete process.env.CLOUDINARY_API_KEY;
  else process.env.CLOUDINARY_API_KEY = originalApiKey;

  if (originalApiSecret === undefined) delete process.env.CLOUDINARY_API_SECRET;
  else process.env.CLOUDINARY_API_SECRET = originalApiSecret;
});
