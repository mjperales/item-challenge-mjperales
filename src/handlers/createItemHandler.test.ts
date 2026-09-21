import { describe, expect, it, afterEach } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { handler } from "./createItemHandler";
import { createEvent } from "../utils/createEvent";

const dynamoMock = mockClient(DynamoDBDocumentClient);

const item = {
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

describe("createItemHandler", () => {
  afterEach(() => {
    dynamoMock.reset();
  });
  it("creates an item", async () => {
    const response = await handler(createEvent(item));
    dynamoMock.on(PutCommand).resolves({
      Attributes: {
        id: "d802fbbf-fa54-49e3-a1e8-9b682670afae",
        ...item,
      },
    });

    expect(response.statusCode).toBe(201);
  });
  it("return 400 error", async () => {
    const rsp = await handler(
      createEvent({
        subject: "AP Biology - missing properties",
        itemType: "multiple-choice",
        difficulty: 3,
      }),
    );
    dynamoMock.on(PutCommand).resolves({});
    expect(rsp.statusCode).toBe(400);
  });
  it("return a 500 error", async () => {
    dynamoMock.on(PutCommand).rejects(new Error("DynamoDB unavailable"));
    const rsp = await handler(createEvent(item));
    expect(rsp.statusCode).toBe(500);
  });
});
