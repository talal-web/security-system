const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];

const OPTIONAL_IN_PRODUCTION = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export const validateEnv = () => {
  const missingRequired = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || !process.env[key].trim(),
  );

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(", ")}`,
    );
  }

  if (process.env.NODE_ENV === "production") {
    const missingOptional = OPTIONAL_IN_PRODUCTION.filter(
      (key) => !process.env[key] || !process.env[key].trim(),
    );

    if (missingOptional.length > 0) {
      console.warn(
        `Warning: missing Cloudinary env vars in production: ${missingOptional.join(
          ", ",
        )}`,
      );
    }
  }
};
