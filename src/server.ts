import { apiReference } from "@scalar/express-api-reference";
import { createExpressEndpoints } from "@ts-rest/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import httpStatus from "http-status";

import { contract } from "./contracts/index.js";
import morganMiddleware from "./middleware/morgan.js";
import notFound from "./middleware/not-found.js";
import { openApiDocument } from "./openapi/document.js";
import router from "./routes/index.js";

const createServer = (): Express => {
  const server = express();

  server.get("/openapi.json", (_req, res) => {
    res.status(httpStatus.OK).json(openApiDocument);
  });
  server.use("/docs", apiReference({ url: "/openapi.json" }));

  server.use(helmet());
  server.use(cors());
  server.use(cookieParser());
  server.use(morganMiddleware);
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  createExpressEndpoints(contract, router, server, { responseValidation: true });

  // error handling for 404  route not found
  server.use(notFound);

  return server;
};

export default createServer;
