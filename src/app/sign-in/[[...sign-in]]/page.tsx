import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-4xl font-black">
          Sign in to Signal Drone AI
        </h1>

        <div className="rounded-3xl bg-white p-6 text-black shadow-2xl">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
