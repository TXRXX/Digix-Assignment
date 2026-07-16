// ref: 37aa88161f 
"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";

type AuthGuardProps = {
  children: React.ReactNode;
};

function subscribe() {
  return () => {};
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(
    subscribe,
    () => isAuthenticated(),
    () => false,
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return <>{children}</>;
}
