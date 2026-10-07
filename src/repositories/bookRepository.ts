import { Op } from "sequelize";
import { Book as BookModel } from "../models/index.js";
import type { Book, BookFilters, NewBook, UpdateBook } from "../types/book.js";
import type { Page, Pagination } from "../types/common.js";

export async function searchBooks(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {
  const where: Record<string, unknown> = {};

  if (filters.title !== undefined) {
    where.title = { [Op.iLike]: `%${filters.title}%` };
  }

  if (filters.available !== undefined) {
    where.available = filters.available;
  }

  if (filters.author_id !== undefined) {
    where.author_id = filters.author_id;
  }

  const { rows, count } = await BookModel.findAndCountAll({
    where,
    limit: pagination.limit,
    offset: (pagination.page - 1) * pagination.limit,
    order: [["id", "ASC"]],
  });

  return {
    data: rows.map((row) => row.toJSON() as Book),
    total: count,
    page: pagination.page,
    limit: pagination.limit,
  };
}

export async function getBookById(id: number): Promise<Book | null> {
  const book = await BookModel.findByPk(id);
  return book ? (book.toJSON() as Book) : null;
}

export async function createBook(data: NewBook): Promise<Book> {
  const book = await BookModel.create({
    title: data.title,
    year: data.year,
    author_id: data.author_id,
    available: data.available ?? true,
  });

  return book.toJSON() as Book;
}

export async function replaceBook(id: number, data: NewBook): Promise<Book | null> {
  const book = await BookModel.findByPk(id);
  if (!book) return null;

  await book.update({
    title: data.title,
    year: data.year,
    author_id: data.author_id,
    available: data.available ?? true,
  });

  return book.toJSON() as Book;
}

export async function updateBook(id: number, data: UpdateBook): Promise<Book | null> {
  const book = await BookModel.findByPk(id);
  if (!book) return null;

  await book.update(data);
  return book.toJSON() as Book;
}

export async function deleteBook(id: number): Promise<boolean> {
  const book = await BookModel.findByPk(id);
  if (!book) return false;

  await book.destroy();
  return true;
}
