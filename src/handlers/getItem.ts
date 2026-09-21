import { z } from "zod";
import { DynamoDBStorage } from "../storage/dynamodb";

const dynamoDB = new DynamoDBStorage();
const idSchema = z.string().uuid();

export const getItem = async (id: string | undefined) => {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    console.info("Invalid ID", { itemId: id });
    return {
      statusCode: 400,
      body: {
        message: "Invalid ID",
      },
    };
  }

  try {
    const id = result.data;
    const item = await dynamoDB.getItem(id);

    if (!item) {
      console.info("Item not found", { itemId: id });
      return {
        statusCode: 404,
        body: { message: "Item not found" },
      };
    }

    console.info("Success finding item");
    return {
      statusCode: 200,
      body: item,
    };
  } catch (error) {
    console.error("Error getting item:", { error });
    return {
      statusCode: 500,
      body: { message: "Internal server error" },
    };
  }
};
