"use client";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Password reset link has been sent to your email address!", 
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setEmail(""); // Clear email field after successful submission
      } else {
        toast.error(data.error || "Failed to send reset link", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-2 pb-2 sm:p-2">
      <ToastContainer />
      <div className="w-full max-w-sm -mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md w-full"
        >
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <input
            type="email"
            className="border p-2 px-3 w-full mb-6 rounded-3xl focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#14a4eb] text-white w-full py-2 rounded-3xl relative cursor-pointer ${
              isLoading ? 'opacity-70' : ''
            }`}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Send Reset Link</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-[#14a4eb] hover:underline text-sm">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
