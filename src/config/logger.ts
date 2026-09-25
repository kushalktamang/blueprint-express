import winston from "winston";
import env from "./env";

const log_level = env.LOG_LEVEL;

const logger = winston.createLogger({
  level: log_level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize(),
  ),
  defaultMeta: { service: "blueprint-express" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.simple(), winston.format.colorize()),
    }),
  );
}

export default logger;
