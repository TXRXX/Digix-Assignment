import express, { type Request, type Response } from "express";
import Book from "../model/Book.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, author, description, publishedAt, category } = req.body;

    if (!title || !author || !description || !category) {
      return res.status(400).json({
        message: "title, author, description, and category are required",
      });
    }

    const book = new Book({ title, author, description, publishedAt, category });
    await book.save();
    res.status(201).json(book);
    console.log(`Book created: ${book}`);
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

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
    console.log(`Book deleted: ${book}`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

export default router;
