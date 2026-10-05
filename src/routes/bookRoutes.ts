import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  replaceBook,
  updateBook,
} from "../controllers/bookController.js";

const router = Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get("/:id", getBookById);
router.put("/:id", replaceBook);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
