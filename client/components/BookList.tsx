"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { api, ApiError } from "@/lib/api";
import type { Book } from "@/types/book";

type BookListProps = {
  refreshKey?: number;
  setIsOpenBookForm: (isOpen: boolean) => void;
  setSelectedBookId: (id: string | null) => void;
  selectedBookId: string | null;
};

export function BookList({
  refreshKey = 0,
  setIsOpenBookForm,
  setSelectedBookId,
  selectedBookId,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;

    return books.filter((book) =>
      book.title.toLowerCase().includes(query),
    );
  }, [books, search]);

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getBooks();
        if (!cancelled) {
          setBooks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load books",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedBookId) return;

    const selectedElement = document.getElementById(`book-${selectedBookId}`);
    selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedBookId, books]);

  async function handleDelete(id: string) {
    const confirm = window.confirm("คุณต้องการลบหนังสือนี้หรือไม่?");
    if (!confirm) return;

    setDeletingId(id);
    setError("");

    try {
      await api.deleteBook(id);
      setBooks((current) => current.filter((book) => book._id !== id));
      if (selectedBookId === id) {
        setSelectedBookId(null);
      }
      toast.success("ลบหนังสือสำเร็จ");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete book",
      );
      setError(err instanceof ApiError ? err.message : "Failed to delete book");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">กำลังโหลดหนังสือ...</p>;
  }

  return (
    <section className="flex w-full flex-col gap-4 h-[80dvh]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-zinc-900">
            รายชื่อหนังสือ
          </h2>
          <span className="text-sm text-zinc-500">
            {search.trim()
              ? `${filteredBooks.length} จาก ${books.length} รายการ`
              : `${books.length} รายการ`}
          </span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setIsOpenBookForm(true)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            เพิ่มหนังสือ
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
          ยังไม่มีหนังสือในระบบ
        </div>
      ) : (
        <div className="flex gap-4 h-[80%] bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <ul className="flex flex-col w-1/2 border-r border-zinc-200 overflow-y-auto">
            <div className="sticky top-0 z-1 border-b border-zinc-200 bg-white p-4">
              <input
                type="text"
                placeholder="ค้นหาชื่อหนังสือ..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none placeholder:text-zinc-400 focus:border-zinc-500"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            {filteredBooks.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-zinc-500">
                ไม่พบหนังสือที่ค้นหา
              </p>
            ) : (
              filteredBooks.map((book) => (
              <li
                key={book._id}
                id={`book-${book._id}`}
                onClick={() => setSelectedBookId(book._id)}
                className={`
                  ${selectedBookId === book._id ? "bg-zinc-100" : ""}
                  flex h-fit items-start justify-between gap-4 border-b border-zinc-200 p-5`}
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">by {book.author}</p>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(book._id);
                  }}
                  disabled={deletingId === book._id}
                  className="cursor-pointer shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === book._id ? "กำลังลบ..." : "ลบ"}
                </button>
              </li>
              ))
            )}
          </ul>
          <div className="w-1/2 p-4">
            {selectedBookId ? (
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {books.find((book) => book._id === selectedBookId)?.title}
                </h3>
                {books.find((book) => book._id === selectedBookId)
                  ?.category && (
                  <p className="text-sm text-zinc-700 bg-orange-100 rounded-full px-3 py-0.5 w-fit">
                    {
                      books.find((book) => book._id === selectedBookId)
                        ?.category
                    }
                  </p>
                )}
                <h4 className="text-sm font-medium text-zinc-600 mt-4">
                  คำอธิบาย
                </h4>
                <p className="text-sm text-zinc-700">
                  {
                    books.find((book) => book._id === selectedBookId)
                      ?.description
                  }
                </p>
                <p className="text-sm text-zinc-700 mt-4">
                  ผู้เขียน:{" "}
                  {books.find((book) => book._id === selectedBookId)?.author}
                </p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
