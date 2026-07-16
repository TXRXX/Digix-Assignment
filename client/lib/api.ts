import { clearToken, getToken } from "@/lib/auth";
import type { Book, CreateBookInput, LoginResponse } from "@/types/book";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(401, data.message ?? "Unauthorized");
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Request failed");
  }

  return data as T;
}

export const api = {
  login(username: string, password: string) {
    return request<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  getBooks() {
    return request<Book[]>("/books");
  },

  createBook(book: CreateBookInput) {
    return request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(book),
    }, true);
  },

  deleteBook(id: string) {
    return request<{ message: string }>(`/books/${id}`, {
      method: "DELETE",
    }, true);
  },
};
