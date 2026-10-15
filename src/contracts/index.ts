import { initContract } from "@ts-rest/core";

import healthContract from "./health.contract.js";

const c = initContract();

export const contract = c.router({ health: healthContract });
