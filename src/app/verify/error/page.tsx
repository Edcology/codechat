"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyError() {
  const params = useSearchParams();
  const reason = params.get("reason");

  let message = "Something went wrong.";
  if (reason === "missing") message = "Verification token missing.";
  if (reason === "invalid") message = "Invalid verification token.";
  if (reason === "expired") message = "Verification link expired.";
  if (reason === "server") message = "Server error. Try again later.";

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold text-red-600">❌ Verification Failed</h1>
      <p>{message}</p>
    </div>
  );
}
