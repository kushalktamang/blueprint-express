import { isAppRoute } from "@ts-rest/core";
import type { AppRoute, AppRouter } from "@ts-rest/core";
import { match, P } from "ts-pattern";
import { z } from "zod";
import { createDocument } from "zod-openapi";
import type { ZodOpenApiOperationObject, ZodOpenApiPathsObject } from "zod-openapi";

import { contract } from "../contracts/index.js";

type NamedRoute = { id: string; route: AppRoute };

// flatten nested routers: { health: { check } } -> [{ id: "health_check", route }]
const collectRoutes = (router: AppRouter, prefix: readonly string[] = []): NamedRoute[] =>
  Object.entries(router).flatMap(([key, node]) =>
    isAppRoute(node)
      ? [{ id: [...prefix, key].join("_"), route: node }]
      : collectRoutes(node, [...prefix, key]),
  );

// exhaustive: adding a method to ts-rest's union breaks the build here
const toMethodKey = (method: AppRoute["method"]) =>
  match(method)
    .with("GET", () => "get" as const)
    .with("POST", () => "post" as const)
    .with("PUT", () => "put" as const)
    .with("PATCH", () => "patch" as const)
    .with("DELETE", () => "delete" as const)
    .exhaustive();

const toOperation = ({ id, route }: NamedRoute): ZodOpenApiOperationObject => {
  const responses = Object.fromEntries(
    Object.entries(route.responses).map(([status, schema]) => [
      status,
      match(schema)
        .with(P.instanceOf(z.ZodType), (zodSchema) => ({
          description: zodSchema.meta()?.description ?? `Response ${status}`,
          content: { "application/json": { schema: zodSchema } },
        }))
        .otherwise(() => ({ description: `Response ${status}` })), // c.noBody() etc.
    ]),
  );

  const body = "body" in route ? route.body : undefined;

  return {
    operationId: id,
    ...(route.summary !== undefined && { summary: route.summary }),
    ...(route.description !== undefined && { description: route.description }),
    requestParams: {
      ...(route.query instanceof z.ZodObject && { query: route.query }),
      ...(route.pathParams instanceof z.ZodObject && { path: route.pathParams }),
    },
    ...(body instanceof z.ZodType && {
      requestBody: { content: { "application/json": { schema: body } } },
    }),
    responses,
  };
};

const paths: ZodOpenApiPathsObject = {};

for (const named of collectRoutes(contract)) {
  // ts-rest ":id" -> OpenAPI "{id}"
  const openApiPath = named.route.path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
  paths[openApiPath] = {
    ...paths[openApiPath],
    [toMethodKey(named.route.method)]: toOperation(named),
  };
}

export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: { title: "Newsletter API", version: "1.0.0" },
  paths,
});
