'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSearchParams } from 'next/navigation'

function PendingContent() {
  const [isResending, setIsResending] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found. Please try signing up again.");
      return;
    }

    setIsResending(true);
    try {
      const res = await fetch('/api/auth/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Verification email resent successfully!');
      } else {
        toast.error(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-2 pb-2 sm:p-2">
      <ToastContainer />
      <main className="flex flex-col items-center justify-center text-center w-full max-w-sm px-2 md:px-0">
        <div className="mb-8">
          <Image
            src="/window.svg"
            alt="Mail verification"
            width={120}
            height={120}
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve sent a verification link to{' '}
          <span className="font-medium">{email}</span>. 
          Please check your inbox and click the link to complete your registration.
        </p>
        <div className="text-sm text-gray-500">
          <p>Didn&apos;t receive the email?</p>
          <p className="mt-2">
            Check your spam folder or{' '}
            <button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-[#14a4eb] hover:underline disabled:opacity-50 disabled:hover:no-underline"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#14a4eb]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resending...
                </span>
              ) : (
                'click here to resend'
              )}
            </button>
          </p>
        </div>
        <Link 
          href="/login" 
          className="mt-8 text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to login
        </Link>
      </main>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="font-sans flex items-center justify-center min-h-screen">Loading...</div>}>
      <PendingContent />
    </Suspense>
  )
}

export default Page