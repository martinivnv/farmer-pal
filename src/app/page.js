import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 w-full content-evenly">
      <main className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full border border-gray-300"
            />
            <h1 className="text-4xl font-bold tracking-tight">FarmerPal</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-driven crop health management to empower farmers globally
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium 
            bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl
            transform hover:scale-105 transition-all duration-200"
        >
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
