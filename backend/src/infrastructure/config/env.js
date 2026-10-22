const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];

const REQUIRED_IN_PRODUCTION = [
  ...REQUIRED_ENV_VARS,
  "FRONTEND_URLS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export const validateEnv = () => {
  const required =
    process.env.NODE_ENV === "production"
      ? REQUIRED_IN_PRODUCTION
      : REQUIRED_ENV_VARS;

  const missingRequired = required.filter(
    (key) => !process.env[key] || !process.env[key].trim(),
  );

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(", ")}`,
    );
  }
};
