export const event = (id?: string) =>
  ({
    version: "2.0",
    routeKey: "GET /items/{id}",
    rawPath: `/items/${id ?? ""}`,
    rawQueryString: "",
    headers: {},
    pathParameters: id ? { id } : undefined,
    requestContext: {},
    isBase64Encoded: false,
  }) as any;
