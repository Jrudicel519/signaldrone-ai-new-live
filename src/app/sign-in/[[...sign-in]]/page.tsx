import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center">
        <Link href="/" className="mb-8 text-cyan-300">
          ← Back to Signal Drone AI
        </Link>

        <h1 className="mb-8 text-center text-4xl font-black">
          Sign in to Signal Drone AI
        </h1>

        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-slate-200",
              headerTitle: "text-slate-950",
              headerSubtitle: "text-slate-600",
              socialButtonsBlockButton:
                "border border-slate-300 text-slate-950",
              formButtonPrimary:
                "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold",
              formFieldInput:
                "text-slate-950 border border-slate-300",
              footerActionLink: "text-cyan-700",
            },
          }}
        />
      </div>
    </main>
  );
}
