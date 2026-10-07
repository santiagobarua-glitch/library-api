import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  replaceBook,
  updateBook,
} from "../controllers/bookController.js";
import { authenticateToken, authorizeRole } from "../middleware/authentication.js";

const router = Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get("/:id", getBookById);
router.put("/:id", replaceBook);
router.patch("/:id", updateBook);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteBook);

export default router;
