import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import notesRouter from "../routes/notes/notesRouter";
import { createNote } from "../dao";
import { verifyJWT } from "../middlewares";

jest.mock("../dao", () => ({
  createNote: jest.fn(),
}));

jest.mock("../middlewares", () => ({
  verifyJWT: jest.fn((req, res, next) => next()),
  noteIdCorrespondsToSessionUserId: jest.fn((req, res, next) => next()),
  validateIdInRequestBody: jest.fn((req, res, next) => next()),
  validateUpdateEntityRequestBody: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/api", notesRouter);

describe("POST request to /api/create-note", () => {
  const mockUserId = 1;
  const mockNewNoteId = 1;
  const mockUsername= "user-test";

  beforeEach(() => {
    (createNote as jest.Mock).mockClear();
    (verifyJWT as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: mockUserId, username: mockUsername };
      next();
    });
  });

  it("should create a new note and return the new note ID", async () => {
    (createNote as jest.Mock).mockResolvedValue(mockNewNoteId);

    const response = await request(app).post("/api/create-note");

    expect(verifyJWT).toHaveBeenCalled();
    expect(createNote).toHaveBeenCalledWith(mockUserId);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ newNoteId: mockNewNoteId });
  });

  it("should handle errors when creating a new note", async () => {
    (createNote as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/api/create-note");

    expect(verifyJWT).toHaveBeenCalled();
    expect(createNote).toHaveBeenCalledWith(mockUserId);
    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal server error");
  });
});
