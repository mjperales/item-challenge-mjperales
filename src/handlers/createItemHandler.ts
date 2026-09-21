import { createItem } from "./createItem";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.body) {
    console.info("Request body is missing.");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is required." }),
    };
  }
  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Request body must be valid JSON.",
      }),
    };
  }

  const result = await createItem(parsedBody);

  return {
    statusCode: result.statusCode,
    body: JSON.stringify(result.body),
  };
};
