import env from "../../config/env.js";

const healthRouter = {
  check: async () => ({
    status: 200 as const,
    body: {
      status: "healthy" as const,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  }),
};

export default healthRouter;
