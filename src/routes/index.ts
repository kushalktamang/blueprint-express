import { initServer } from "@ts-rest/express";
import type { createExpressEndpoints } from "@ts-rest/express";

import { contract } from "../contracts/index.js";
import healthRouter from "./health/health.routes.js";

const s = initServer();
type ContractRouter = Parameters<typeof createExpressEndpoints<typeof contract>>[1];

// ts-rest's inferred nested-router type rejects this contract-matching handler shape.
const router = s.router(contract, { health: healthRouter } as unknown as ContractRouter);

export default router;
