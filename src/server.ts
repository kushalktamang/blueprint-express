import checkHealth from "./routes/healthz";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./config/logger";
import httpStatus from "http-status";

const createServer = (): Express => {
  const server = express();

  server.use(helmet());
  server.use(cors());
  server.use(cookieParser());
  server.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/", (_, res) => {
    logger.info("blueprint for express with typescript");

    res.status(httpStatus.OK).send("blueprint for express with typescript");
  });
  // @GET /api/v1/healthz
  server.use("/api/v1/", checkHealth());

  return server;
};

export default createServer;
