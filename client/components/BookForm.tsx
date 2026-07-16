"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import { api, ApiError } from "@/lib/api";

type BookFormProps = {
  onCreated: () => void;
  setIsOpenBookForm: (isOpen: boolean) => void;
  setSelectedBookId: (id: string | null) => void;
};

export function BookForm({ onCreated, setIsOpenBookForm, setSelectedBookId }: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const book = await api.createBook({ title, author, description, category });
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setSelectedBookId(book._id);
      onCreated();
      setIsOpenBookForm(false);
      toast.success("บันทึกหนังสือสำเร็จ");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create book");
      setError(err instanceof ApiError ? err.message : "Failed to create book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[10] flex items-center justify-center">
      <section>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">เพิ่มหนังสือ</h2>
            <button
              type="button"
              onClick={() => setIsOpenBookForm(false)}
              className="rounded-full border border-zinc-300 p-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-2"> */}
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              ชื่อหนังสือ
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>
          {/* </div> */}
          
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              หมวดหมู่
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              ผู้เขียน
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            คำอธิบาย
            <textarea
              className="min-h-24 rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </section>
    </div>
  );
}
