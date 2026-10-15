import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const HealthResponse = z.object({
  status: z.enum(["healthy", "unhealthy"]),
  timestamp: z.iso.datetime(),
  environment: z.string(),
});

const healthContract = c.router({
  check: {
    description: "Get health status",
    method: "GET",
    path: "/v1/healthz",
    summary: "Health check",
    responses: { 200: HealthResponse },
  },
});

export default healthContract;
