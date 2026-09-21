import { describe, expect, it, afterEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "./getItemHandler";
import { event } from "../utils/event";

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe("getItemHandler", () => {
  afterEach(() => {
    dynamoMock.reset();
  });
  it("returns 400 for an invalid ID", async () => {
    dynamoMock.on(GetCommand).resolves({});
    const response = await handler(event("not-a-uuid"));
    expect(response.statusCode).toBe(400);
  });

  it("returns 404 when item is not found", async () => {
    dynamoMock.on(GetCommand).resolves({ Item: undefined });
    const response = await handler(
      event("c0467834-ecd5-44b1-8593-3bfc97f3da23"),
    );
    expect(response.statusCode).toBe(404);
  });

  it("returns 200 success status code", async () => {
    const item = {
      id: "d802fbbf-fa54-49e3-a1e8-9b682670afae",
      subject: "AP Biology",
      itemType: "multiple-choice",
      difficulty: 3,
      content: {
        question: "What is photosynthesis?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation:
          "Photosynthesis is the process by which plants, algae, and some bacteria use sunlight to convert water and carbon dioxide into glucose and oxygen.",
      },
      metadata: {
        author: "test-author",
        status: "draft",
        tags: ["biology", "photosynthesis"],
      },
      securityLevel: "standard",
    };
    dynamoMock.on(GetCommand).resolves({
      Item: item,
    });
    const response = await handler(event(item.id));
    expect(response.statusCode).toBe(200);
  });
  it("returns 500 when DynamoDB fails", async () => {
    dynamoMock.on(GetCommand).rejects(new Error("DynamoDB unavailable"));
    const response = await handler(
      event("d802fbbf-fa54-49e3-a1e8-9b682670afae"),
    );

    expect(response.statusCode).toBe(500);
  });
});
