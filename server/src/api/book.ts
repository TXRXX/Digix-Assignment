import express, { type Request, type Response } from "express";
import Book from "../model/Book.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, author, description, publishedAt } = req.body;

    if (!title || !author || !description) {
      return res.status(400).json({
        message: "title, author, and description are required",
      });
    }

    const book = new Book({ title, author, description, publishedAt });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

export default router;
