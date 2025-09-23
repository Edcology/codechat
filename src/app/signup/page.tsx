'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Page = () => {
    const router = useRouter();
    type FormState = {
        email: string,
        password: string,
        username: string
    }
    const [formData, setFormData] = useState<FormState>({ email: "", password: "", username: "" })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    
        try {
          const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
    
          if (res.ok) {
            // ✅ Signup success
            toast.success("Account created successfully! Please check your email.", {
              position: "top-right",
              autoClose: 2000,
            });
            setTimeout(() => {
              router.push(`/verify/pending?email=${encodeURIComponent(formData.email)}`);
            }, 1000);
          } else {
            const data = await res.json();
            const errorMessage = data.error || "Sign Up failed";
            setError(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (err) {
          console.error("Login request error:", err);
          const errorMessage = "Something went wrong. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage, {
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
        <main className="flex flex-col items-center justify-center text-center w-full max-w-sm px-2 md:px-0 -mt-20">
            <h1 className="text-4xl font-bold mb-1">CodeChat</h1>
            <p className="text-md mb-6 text-gray-500">Create an account and join our network today</p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <input 
                    className="border border-gray-500 focus:outline-none p-2 px-3 w-full mb-4 rounded-3xl"
                    type="email" 
                    placeholder="Email" 
                    value={formData?.email || ""} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
                <input 
                    className="border border-gray-500 focus:outline-none p-2 px-3 w-full mb-4 rounded-3xl"
                    type="text" 
                    placeholder="Username" 
                    value={formData?.username || ""} 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
                <div className="relative w-full mb-4">
                    <input 
                        className="border border-gray-500 focus:outline-none p-2 px-3 w-full rounded-3xl pr-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" 
                        value={formData?.password || ""} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            // Eye slash icon (hidden)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            // Eye icon (visible)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-[#14a4eb] text-white p-2 rounded-3xl w-full cursor-pointer relative ${
                        isLoading ? 'opacity-70' : ''
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="opacity-0">Sign Up</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            </div>
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
                <p className="mt-4">Already have an account? <Link href="/login"><span className="text-[#14a4eb] font-medium">Sign In</span></Link></p>
            </form>
        </main>
    </div>
  )
}

export default Page