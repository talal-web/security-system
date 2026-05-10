import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),

    // 🔥 Clean structured format
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return JSON.stringify(
        {
          level,
          message,
          timestamp,
          ...meta,
        },
        null,
        2,
      );
    }),
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    new winston.transports.Console(),
  ],
});

export default logger;
