import Link from "next/link";

export default function VerifySuccess() {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold text-[#14a4eb]">Email Verified! ✅</h1>
      <p>You can now log in to your account.</p>
      <Link href="/login" className="w-full max-w-sm">
        <button className="mt-4 bg-[#14a4eb] text-white p-2 rounded-3xl w-full cursor-pointer">
          Login
        </button>
      </Link>
    </div>
  );
}
