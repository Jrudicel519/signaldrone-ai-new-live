import json
import random
from pathlib import Path
from datetime import datetime

SIGNALS_FILE = Path("src/data/signals.json")

ASSETS = [
    {
        "symbol": "BTC-USD",
        "name": "Bitcoin",
        "base_price": 65000,
        "price_step": 500,
    },
    {
        "symbol": "ETH-USD",
        "name": "Ethereum",
        "base_price": 3200,
        "price_step": 75,
    },
    {
        "symbol": "SOL-USD",
        "name": "Solana",
        "base_price": 150,
        "price_step": 5,
    },
    {
        "symbol": "AVAX-USD",
        "name": "Avalanche",
        "base_price": 35,
        "price_step": 2,
    },
    {
        "symbol": "LINK-USD",
        "name": "Chainlink",
        "base_price": 15,
        "price_step": 1,
    },
    {
        "symbol": "ADA-USD",
        "name": "Cardano",
        "base_price": 0.45,
        "price_step": 0.03,
    },
    {
        "symbol": "DOGE-USD",
        "name": "Dogecoin",
        "base_price": 0.14,
        "price_step": 0.01,
    },
    {
        "symbol": "XRP-USD",
        "name": "XRP",
        "base_price": 0.55,
        "price_step": 0.03,
    },
    {
        "symbol": "MATIC-USD",
        "name": "Polygon",
        "base_price": 0.75,
        "price_step": 0.04,
    },
    {
        "symbol": "DOT-USD",
        "name": "Polkadot",
        "base_price": 6.25,
        "price_step": 0.3,
    },
]

REASONS = {
    "Bullish": [
        "The demo bot detected improving momentum compared with the recent baseline.",
        "The demo bot detected stronger buying pressure and a cleaner trend structure.",
        "The demo bot found rising relative strength compared with other assets in the watchlist.",
        "The demo bot detected a possible continuation setup with controlled volatility.",
    ],
    "Bearish": [
        "The demo bot detected weakening momentum and increased downside risk.",
        "The demo bot found lower relative strength compared with other assets in the watchlist.",
        "The demo bot detected selling pressure increasing compared with the recent baseline.",
        "The demo bot marked this as a defensive research signal due to weaker trend conditions.",
    ],
    "Neutral": [
        "The demo bot detected mixed momentum, so this is marked as a watchlist signal.",
        "The demo bot found no strong edge yet, but the asset remains worth monitoring.",
        "The demo bot detected sideways behavior with no clear directional confirmation.",
        "The demo bot marked this as neutral because volatility is elevated and direction is unclear.",
    ],
}

def load_signals():
    if not SIGNALS_FILE.exists():
        return []

    with SIGNALS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)

def save_signals(signals):
    with SIGNALS_FILE.open("w", encoding="utf-8") as file:
        json.dump(signals, file, indent=2)

def get_next_id(signals):
    if not signals:
        return 1

    return max(signal["id"] for signal in signals) + 1

def format_price(value):
    if value >= 1000:
        return f"${value:,.0f}"
    if value >= 10:
        return f"${value:,.2f}"
    return f"${value:.4f}"

def create_price_zones(asset, direction):
    base_price = asset["base_price"]
    step = asset["price_step"]

    price = base_price + random.uniform(-step * 2, step * 2)

    entry_low = price - step
    entry_high = price + step

    if direction == "Bearish":
        stop_loss = entry_high + step
        take_profit_1 = entry_low - step
        take_profit_2 = entry_low - step * 2
        take_profit_3 = entry_low - step * 3
    else:
        stop_loss = entry_low - step
        take_profit_1 = entry_high + step
        take_profit_2 = entry_high + step * 2
        take_profit_3 = entry_high + step * 3

    return {
        "entryZone": f"{format_price(entry_low)} - {format_price(entry_high)}",
        "stopLoss": format_price(stop_loss),
        "takeProfit": [
            format_price(take_profit_1),
            format_price(take_profit_2),
            format_price(take_profit_3),
        ],
    }

def create_demo_signal(signals):
    asset = random.choice(ASSETS)
    direction = random.choice(["Bullish", "Bullish", "Neutral", "Bearish"])
    confidence = random.randint(52, 88)

    if confidence >= 78:
        risk = random.choice(["Low", "Medium"])
    elif confidence >= 62:
        risk = random.choice(["Medium", "Medium", "High"])
    else:
        risk = random.choice(["Medium", "High"])

    zones = create_price_zones(asset, direction)

    return {
        "id": get_next_id(signals),
        "symbol": asset["symbol"],
        "name": asset["name"],
        "direction": direction,
        "confidence": confidence,
        "risk": risk,
        "entryZone": zones["entryZone"],
        "stopLoss": zones["stopLoss"],
        "takeProfit": zones["takeProfit"],
        "reason": random.choice(REASONS[direction]),
        "date": datetime.now().strftime("%Y-%m-%d"),
    }

def main():
    signals = load_signals()
    new_signal = create_demo_signal(signals)

    signals.insert(0, new_signal)
    save_signals(signals)

    print("✅ New realistic demo signal added successfully.")
    print(f"Symbol: {new_signal['symbol']}")
    print(f"Name: {new_signal['name']}")
    print(f"Direction: {new_signal['direction']}")
    print(f"Confidence: {new_signal['confidence']}%")
    print(f"Risk: {new_signal['risk']}")
    print(f"Entry Zone: {new_signal['entryZone']}")
    print(f"Stop Loss: {new_signal['stopLoss']}")
    print(f"Take Profit: {', '.join(new_signal['takeProfit'])}")
    print(f"ID: {new_signal['id']}")
    print()
    print("Open the Dashboard or History page to see it.")
    print("Educational demo only. Not financial advice.")

if __name__ == "__main__":
    main()
