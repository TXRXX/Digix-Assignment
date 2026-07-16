// ref: 37aa88161f 
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { api, ApiError } from "@/lib/api";
import { isAuthenticated, setToken } from "@/lib/auth";

function subscribe() {
  return () => {};
}

export default function LoginPage() {
  const router = useRouter();
  const alreadyAuthenticated = useSyncExternalStore(
    subscribe,
    () => isAuthenticated(),
    () => false,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alreadyAuthenticated) {
      router.replace("/");
    }
  }, [alreadyAuthenticated, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(username, password);
      setToken(data.token);
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (alreadyAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-zinc-900">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-zinc-500">เข้าสู่ระบบเพื่อจัดการหนังสือของคุณ</p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Username
            <input
              className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Password
            <input
              type="password"
              className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
