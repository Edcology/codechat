import Image from "next/image";
import Link from "next/link";
import og from '../../public/logo.png'

export default function Home() {
  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-2 pb-2 sm:p-2">
      <main className="flex flex-col items-center justify-center text-center space-y-6 w-sm">
        <div className="flex items-center gap-2 justify-center align-middle space-y-4">
          <h1 className="text-4xl font-bold">CodeChat</h1>
          <Image src={og} alt="Chatting" width={80} height={100} priority />
        </div>
        <h2 className="text-2xl">Connect, Learn, and Grow</h2>
        <p>Join a community of developers to network and improve your connections</p>
        <Link className="w-full" href='/login'><button className="bg-[#14a4eb] text-white p-3 cursor-pointer rounded-3xl w-full">Login</button></Link>
        <Link className="w-full" href='/signup'><button className="bg-[#14a4eb] text-white p-3 cursor-pointer rounded-3xl w-full">Sign Up</button></Link>
      </main>
    </div>
  );
}
