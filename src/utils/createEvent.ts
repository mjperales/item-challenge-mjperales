import type { APIGatewayProxyEventV2 } from "aws-lambda";

export const createEvent = (body: unknown): APIGatewayProxyEventV2 =>
  ({
    version: "2.0",
    routeKey: "POST /items",
    rawPath: "/items",
    rawQueryString: "",
    headers: {
      "content-type": "application/json",
    },
    requestContext: {},
    body: JSON.stringify(body),
    isBase64Encoded: false,
  }) as unknown as APIGatewayProxyEventV2;
