import { getItem } from "./getItem";

import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const result = await getItem(event.pathParameters?.id);

  return {
    statusCode: result.statusCode,
    body: JSON.stringify(result.body),
  };
};
