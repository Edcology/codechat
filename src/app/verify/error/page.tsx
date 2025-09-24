"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyErrorContent() {
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

export default function VerifyError() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <VerifyErrorContent />
    </Suspense>
  );
}
