export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          How V4 Signals Works
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          V4 Signals is an AI-powered crypto signal dashboard built around
          paper trading. It helps users watch crypto market conditions, review
          signal confidence, and study simulated trade performance.
        </p>

        <div className="space-y-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">1. The Bot Scans the Market</h2>
            <p className="text-gray-400">
              The V4 bot watches crypto markets and looks for possible bullish
              setups based on market conditions, momentum, and signal rules.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">2. Signals Get a Confidence Score</h2>
            <p className="text-gray-400">
              When the bot finds a possible setup, it assigns a confidence score
              and provides reasoning so users can understand why the signal appeared.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">3. Trades Are Paper-Traded Only</h2>
            <p className="text-gray-400">
              The app does not place real trades. It tracks simulated paper
              trades only, so users can review results without the app handling real money.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-3">4. Users Review the Results</h2>
            <p className="text-gray-400">
              Users can view open paper trades, closed paper trades, confidence
              levels, and performance stats to understand how the signal system is behaving.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-yellow-900/30 border border-yellow-700 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-3">Important Disclaimer</h2>
          <p className="text-gray-300">
            V4 Signals is for educational and informational purposes only.
            It is not financial advice. Crypto trading is risky, and paper-trading
            results do not guarantee future real-world results.
          </p>
        </div>
      </section>
    </main>
  );
}
