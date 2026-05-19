import json
import random
from datetime import datetime
from pathlib import Path

BOT_SIGNAL_FILE = Path("bot_output/latest_signal.json")

ASSETS = [
    {"symbol": "BTC-USD", "name": "Bitcoin", "base_price": 65000, "step": 700},
    {"symbol": "ETH-USD", "name": "Ethereum", "base_price": 3200, "step": 90},
    {"symbol": "SOL-USD", "name": "Solana", "base_price": 150, "step": 6},
    {"symbol": "AVAX-USD", "name": "Avalanche", "base_price": 35, "step": 2},
    {"symbol": "LINK-USD", "name": "Chainlink", "base_price": 15, "step": 1},
    {"symbol": "ADA-USD", "name": "Cardano", "base_price": 0.45, "step": 0.04},
    {"symbol": "DOGE-USD", "name": "Dogecoin", "base_price": 0.14, "step": 0.015},
    {"symbol": "XRP-USD", "name": "XRP", "base_price": 0.55, "step": 0.04},
]

def format_price(value):
    if value >= 1000:
        return f"${value:,.0f}"
    if value >= 10:
        return f"${value:,.2f}"
    return f"${value:.4f}"

def build_zones(asset, direction):
    base = asset["base_price"]
    step = asset["step"]

    current = base + random.uniform(-step * 2, step * 2)
    entry_low = current - step
    entry_high = current + step

    if direction == "Bearish":
        stop_loss = entry_high + step
        take_profit = [
            entry_low - step,
            entry_low - step * 2,
            entry_low - step * 3,
        ]
    else:
        stop_loss = entry_low - step
        take_profit = [
            entry_high + step,
            entry_high + step * 2,
            entry_high + step * 3,
        ]

    return {
        "entryZone": f"{format_price(entry_low)} - {format_price(entry_high)}",
        "stopLoss": format_price(stop_loss),
        "takeProfit": [format_price(price) for price in take_profit],
    }

def build_reason(direction, confidence, risk):
    if direction == "Bullish":
        return (
            f"The mock bot detected bullish momentum with a {confidence}% confidence score. "
            f"Risk is marked {risk} based on volatility and recent price movement. "
            "This is sample educational research data only."
        )

    if direction == "Bearish":
        return (
            f"The mock bot detected bearish pressure with a {confidence}% confidence score. "
            f"Risk is marked {risk} because downside volatility may be elevated. "
            "This is sample educational research data only."
        )

    return (
        f"The mock bot detected mixed conditions with a {confidence}% confidence score. "
        f"Risk is marked {risk}, and the signal is treated as watchlist research only. "
        "This is sample educational research data only."
    )

def create_latest_signal():
    asset = random.choice(ASSETS)
    direction = random.choice(["Bullish", "Bullish", "Neutral", "Bearish"])
    confidence = random.randint(55, 89)

    if confidence >= 78:
        risk = random.choice(["Low", "Medium"])
    elif confidence >= 65:
        risk = random.choice(["Medium", "Medium", "High"])
    else:
        risk = random.choice(["Medium", "High"])

    zones = build_zones(asset, direction)

    return {
        "symbol": asset["symbol"],
        "name": asset["name"],
        "direction": direction,
        "confidence": confidence,
        "risk": risk,
        "entryZone": zones["entryZone"],
        "stopLoss": zones["stopLoss"],
        "takeProfit": zones["takeProfit"],
        "reason": build_reason(direction, confidence, risk),
        "date": datetime.now().strftime("%Y-%m-%d"),
    }

def main():
    signal = create_latest_signal()

    BOT_SIGNAL_FILE.parent.mkdir(parents=True, exist_ok=True)

    with BOT_SIGNAL_FILE.open("w", encoding="utf-8") as file:
        json.dump(signal, file, indent=2)

    print("✅ Mock bot exported latest_signal.json")
    print(f"File: {BOT_SIGNAL_FILE}")
    print(f"Symbol: {signal['symbol']}")
    print(f"Direction: {signal['direction']}")
    print(f"Confidence: {signal['confidence']}%")
    print(f"Risk: {signal['risk']}")
    print()
    print("Next command:")
    print("python3 scripts/import_latest_bot_signal.py")

if __name__ == "__main__":
    main()
