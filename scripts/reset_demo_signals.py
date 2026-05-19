import json
from pathlib import Path

SIGNALS_FILE = Path("src/data/signals.json")

DEFAULT_SIGNALS = [
    {
        "id": 1,
        "symbol": "BTC-USD",
        "name": "Bitcoin",
        "direction": "Bullish",
        "confidence": 82,
        "risk": "Medium",
        "entryZone": "$63,500 - $65,000",
        "stopLoss": "$61,200",
        "takeProfit": ["$67,500", "$70,000", "$73,000"],
        "reason": "Momentum improved while volatility stayed controlled. The demo bot detected stronger buying pressure compared with the recent average.",
        "date": "2026-05-06"
    },
    {
        "id": 2,
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "direction": "Bullish",
        "confidence": 76,
        "risk": "Medium",
        "entryZone": "$3,050 - $3,150",
        "stopLoss": "$2,920",
        "takeProfit": ["$3,280", "$3,450", "$3,700"],
        "reason": "The demo signal triggered after price strength increased and volume activity improved compared with the previous period.",
        "date": "2026-05-06"
    },
    {
        "id": 3,
        "symbol": "SOL-USD",
        "name": "Solana",
        "direction": "Neutral",
        "confidence": 64,
        "risk": "High",
        "entryZone": "$142 - $148",
        "stopLoss": "$134",
        "takeProfit": ["$154", "$162", "$175"],
        "reason": "The demo bot sees possible upside, but volatility is higher than normal, so the risk rating is elevated.",
        "date": "2026-05-06"
    },
    {
        "id": 4,
        "symbol": "AVAX-USD",
        "name": "Avalanche",
        "direction": "Bullish",
        "confidence": 71,
        "risk": "Medium",
        "entryZone": "$33 - $35",
        "stopLoss": "$31",
        "takeProfit": ["$37", "$40", "$44"],
        "reason": "Relative strength improved compared with other demo assets in the watchlist.",
        "date": "2026-05-05"
    },
    {
        "id": 5,
        "symbol": "LINK-USD",
        "name": "Chainlink",
        "direction": "Neutral",
        "confidence": 58,
        "risk": "Medium",
        "entryZone": "$14.20 - $14.80",
        "stopLoss": "$13.40",
        "takeProfit": ["$15.60", "$16.50", "$18.00"],
        "reason": "The demo bot detected mixed momentum. This would be a watchlist signal, not a strong conviction signal.",
        "date": "2026-05-05"
    },
    {
        "id": 6,
        "symbol": "ADA-USD",
        "name": "Cardano",
        "direction": "Bearish",
        "confidence": 61,
        "risk": "High",
        "entryZone": "$0.43 - $0.45",
        "stopLoss": "$0.47",
        "takeProfit": ["$0.40", "$0.38", "$0.35"],
        "reason": "The demo bot detected weaker short-term momentum and a higher-risk setup.",
        "date": "2026-05-04"
    },
    {
        "id": 7,
        "symbol": "DOGE-USD",
        "name": "Dogecoin",
        "direction": "Neutral",
        "confidence": 55,
        "risk": "High",
        "entryZone": "$0.135 - $0.145",
        "stopLoss": "$0.125",
        "takeProfit": ["$0.155", "$0.170", "$0.190"],
        "reason": "The demo bot detected high volatility, so this signal is marked as speculative.",
        "date": "2026-05-04"
    },
    {
        "id": 8,
        "symbol": "XRP-USD",
        "name": "XRP",
        "direction": "Bullish",
        "confidence": 69,
        "risk": "Medium",
        "entryZone": "$0.52 - $0.55",
        "stopLoss": "$0.49",
        "takeProfit": ["$0.58", "$0.62", "$0.68"],
        "reason": "The demo bot detected a possible continuation pattern with moderate confidence.",
        "date": "2026-05-03"
    },
    {
        "id": 9,
        "symbol": "MATIC-USD",
        "name": "Polygon",
        "direction": "Neutral",
        "confidence": 52,
        "risk": "Medium",
        "entryZone": "$0.71 - $0.75",
        "stopLoss": "$0.67",
        "takeProfit": ["$0.79", "$0.84", "$0.90"],
        "reason": "The demo bot found no strong edge yet, so this is shown as a lower-confidence research signal.",
        "date": "2026-05-03"
    },
    {
        "id": 10,
        "symbol": "DOT-USD",
        "name": "Polkadot",
        "direction": "Bullish",
        "confidence": 66,
        "risk": "Medium",
        "entryZone": "$6.10 - $6.40",
        "stopLoss": "$5.80",
        "takeProfit": ["$6.80", "$7.30", "$8.00"],
        "reason": "The demo bot detected improving momentum compared with the recent baseline.",
        "date": "2026-05-02"
    }
]

def main():
    SIGNALS_FILE.parent.mkdir(parents=True, exist_ok=True)

    with SIGNALS_FILE.open("w", encoding="utf-8") as file:
        json.dump(DEFAULT_SIGNALS, file, indent=2)

    print("✅ Demo signals reset successfully.")
    print(f"Reset file: {SIGNALS_FILE}")
    print(f"Signal count: {len(DEFAULT_SIGNALS)}")
    print("Open the Dashboard or History page to confirm.")

if __name__ == "__main__":
    main()
