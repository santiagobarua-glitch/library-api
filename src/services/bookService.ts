import { Author } from "../models/index.js";
import { createBook, deleteBook, getBookById, replaceBook, searchBooks, updateBook } from "../repositories/bookRepository.js";
import type { Book, BookFilters, NewBook, UpdateBook } from "../types/book.js";
import type { Page, Pagination } from "../types/common.js";

function normalizeTitle(value: string | undefined): string {
  if (value === undefined || value.trim() === "") {
    throw new Error("Book title is required");
  }

  return value.trim();
}

function normalizeYear(value: number | undefined): number {
  if (value === undefined || !Number.isInteger(value)) {
    throw new Error("Book year is required");
  }

  return value;
}

function normalizeAuthorId(value: number | undefined): number {
  if (value === undefined || !Number.isInteger(value) || value <= 0) {
    throw new Error("Book author_id is required");
  }

  return value;
}

export async function searchBooksForPage(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {
  return searchBooks(filters, pagination);
}

export async function getBook(id: number): Promise<Book> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book id");
  }

  const book = await getBookById(id);
  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

export async function createNewBook(data: NewBook): Promise<Book> {
  const title = normalizeTitle(data.title);
  const year = normalizeYear(data.year);
  const author_id = normalizeAuthorId(data.author_id);

  const author = await Author.findByPk(author_id);
  if (!author) {
    throw new Error("Author not found");
  }

  return createBook({ title, year, author_id, available: true });
}

export async function replaceExistingBook(id: number, data: NewBook): Promise<Book> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book id");
  }

  const title = normalizeTitle(data.title);
  const year = normalizeYear(data.year);
  const author_id = normalizeAuthorId(data.author_id);

  const author = await Author.findByPk(author_id);
  if (!author) {
    throw new Error("Author not found");
  }

  const book = await replaceBook(id, { title, year, author_id, available: true });
  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

export async function updateExistingBook(id: number, data: UpdateBook): Promise<Book> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book id");
  }

  const payload: UpdateBook = {};

  if (data.title !== undefined) {
    payload.title = normalizeTitle(data.title);
  }

  if (data.year !== undefined) {
    payload.year = normalizeYear(data.year);
  }

  if (data.author_id !== undefined) {
    const author_id = normalizeAuthorId(data.author_id);
    const author = await Author.findByPk(author_id);
    if (!author) {
      throw new Error("Author not found");
    }
    payload.author_id = author_id;
  }

  if (data.available !== undefined) {
    payload.available = data.available;
  }

  const book = await updateBook(id, payload);
  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

export async function removeBook(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid book id");
  }

  const deleted = await deleteBook(id);
  if (!deleted) {
    throw new Error("Book not found");
  }
}
