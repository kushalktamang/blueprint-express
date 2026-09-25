import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import checkHealth from "./routes/healthz";

const createServer = (): Express => {
  const server = express();

  server.use(express.json());
  server.use(cookieParser());

  // @GET /api/v1/healthz
  server.use("/api/v1/", checkHealth());

  return server;
};

export default createServer;
