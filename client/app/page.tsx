"use client";

import { useState } from "react";

import { BookForm } from "@/components/BookForm";
import { BookList } from "@/components/BookList";
import { AuthGuard } from "@/components/AuthGuard";
import { logout } from "@/lib/auth";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpenBookForm, setIsOpenBookForm] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);


  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">ระบบหนังสือ</h1>
              <p className="text-sm text-zinc-500">
                จัดการหนังสือของคุณ
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              ออกจากระบบ
            </button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
          {isOpenBookForm ? (
            <BookForm
              onCreated={() => setRefreshKey((current) => current + 1)}
              setIsOpenBookForm={setIsOpenBookForm}
              setSelectedBookId={setSelectedBookId}
            />
          ) : null}
          <BookList
            refreshKey={refreshKey}
            setIsOpenBookForm={setIsOpenBookForm}
            setSelectedBookId={setSelectedBookId}
            selectedBookId={selectedBookId}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
