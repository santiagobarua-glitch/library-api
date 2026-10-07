import type { Request, Response } from "express";
import {
  createNewBook,
  getBook,
  removeBook,
  replaceExistingBook,
  searchBooksForPage,
  updateExistingBook,
} from "../services/bookService.js";

function parsePositiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function parseBooleanQuery(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}

export async function getBooks(req: Request, res: Response) {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 50);

    if (req.query.page !== undefined && !/^\d+$/.test(String(req.query.page))) {
      throw new Error("Page must be a positive integer");
    }

    if (req.query.limit !== undefined && !/^\d+$/.test(String(req.query.limit))) {
      throw new Error("Limit must be a positive integer");
    }

    const result = await searchBooksForPage(
      {
        title: typeof req.query.title === "string" ? req.query.title : undefined,
        available: parseBooleanQuery(req.query.available),
        author_id: req.query.author_id !== undefined ? Number(req.query.author_id) : undefined,
      },
      { page, limit }
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const book = await getBook(id);
    res.json({ data: book });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message === "Book not found" ? 404 : 400;
    res.status(status).json({ error: message });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const book = await createNewBook(req.body);
    res.status(201).json({ data: book });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message === "Author not found" ? 404 : 400;
    res.status(status).json({ error: message });
  }
}

export async function replaceBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const book = await replaceExistingBook(id, req.body);
    res.json({ data: book });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message === "Book not found" || message === "Author not found" ? 404 : 400;
    res.status(status).json({ error: message });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const book = await updateExistingBook(id, req.body);
    res.json({ data: book });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message === "Book not found" || message === "Author not found" ? 404 : 400;
    res.status(status).json({ error: message });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await removeBook(id);
    res.status(204).send();
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message === "Book not found" ? 404 : 400;
    res.status(status).json({ error: message });
  }
}
