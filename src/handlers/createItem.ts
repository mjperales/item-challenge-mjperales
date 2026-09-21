import { DynamoDBStorage } from "../storage/dynamodb";
import { createItemSchema } from "./createItem.schema";

import type { CreateItemRequest } from "../types/item";

const dynamoDB = new DynamoDBStorage();

export const createItem = async (input: CreateItemRequest) => {
  const result = createItemSchema.safeParse(input);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => {
        const field = issue.path.join(",") || "body";
        return `${field}: ${issue.message}`;
      })
      .join("; ");

    console.error("Error:", { errors });
    return {
      statusCode: 400,
      body: { message: errors },
    };
  }

  try {
    const item = await dynamoDB.createItem(result.data);

    console.info("Success: item added.");
    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error("Internal server error", { error });
    return {
      statusCode: 500,
      body: { message: "Internal server error" },
    };
  }
};
