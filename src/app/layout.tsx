import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Signal Lab V4",
  description: "V4 AI crypto signal dashboard for paper-trading research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}

          <footer className="bg-black text-gray-400 border-t border-gray-800 px-6 py-8">
            <div className="max-w-5xl mx-auto text-sm space-y-3">
              <p>
                V4 Signals is an educational paper-trading crypto signal dashboard.
                It does not provide financial advice, does not execute trades,
                does not manage user funds, and does not guarantee profits.
              </p>

              <p>
                Crypto trading is risky. Paper-trading results are simulated and
                may not match real trading results. Users are responsible for their
                own decisions.
              </p>

              <div className="flex flex-wrap gap-4 pt-3">
                <a href="/" className="hover:text-white">Home</a>
                <a href="/how-it-works" className="hover:text-white">How It Works</a>
                <a href="/performance" className="hover:text-white">Performance</a>
                <a href="/pricing" className="hover:text-white">Pricing</a>
                <a href="/account" className="hover:text-white">Account</a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
