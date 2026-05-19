import json
from pathlib import Path
from datetime import datetime

SIGNALS_FILE = Path("src/data/signals.json")
BOT_SIGNAL_FILE = Path("bot_output/latest_signal.json")

VALID_DIRECTIONS = {"Bullish", "Bearish", "Neutral"}
VALID_RISKS = {"Low", "Medium", "High"}

REQUIRED_FIELDS = [
    "symbol",
    "name",
    "direction",
    "confidence",
    "risk",
    "entryZone",
    "stopLoss",
    "takeProfit",
    "reason",
]


def load_json(path):
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)


def get_next_id(signals):
    if not signals:
        return 1

    return max(signal.get("id", 0) for signal in signals) + 1


def validate_signal(signal):
    missing_fields = [field for field in REQUIRED_FIELDS if field not in signal]

    if missing_fields:
        raise ValueError(f"Bot signal is missing fields: {missing_fields}")

    if signal["direction"] not in VALID_DIRECTIONS:
        raise ValueError(
            f"Invalid direction: {signal['direction']}. "
            f"Allowed: {sorted(VALID_DIRECTIONS)}"
        )

    if signal["risk"] not in VALID_RISKS:
        raise ValueError(
            f"Invalid risk: {signal['risk']}. "
            f"Allowed: {sorted(VALID_RISKS)}"
        )

    try:
        confidence = int(signal["confidence"])
    except ValueError:
        raise ValueError("Confidence must be a whole number from 0 to 100")

    if confidence < 0 or confidence > 100:
        raise ValueError("Confidence must be between 0 and 100")

    if not isinstance(signal["takeProfit"], list):
        raise ValueError("takeProfit must be a list/array of strings")


def normalize_bot_signal(bot_signal, existing_id=None):
    return {
        "id": existing_id,
        "symbol": bot_signal["symbol"],
        "name": bot_signal["name"],
        "direction": bot_signal["direction"],
        "confidence": int(bot_signal["confidence"]),
        "risk": bot_signal["risk"],
        "entryZone": bot_signal["entryZone"],
        "stopLoss": bot_signal["stopLoss"],
        "takeProfit": bot_signal["takeProfit"],
        "reason": bot_signal["reason"],
        "date": bot_signal.get("date", datetime.now().strftime("%Y-%m-%d")),
        "source": "bot",
    }


def main():
    signals = load_json(SIGNALS_FILE)
    bot_signal = load_json(BOT_SIGNAL_FILE)

    validate_signal(bot_signal)

    bot_symbol = bot_signal["symbol"]
    matching_index = None

    for index, signal in enumerate(signals):
        if signal.get("symbol") == bot_symbol:
            matching_index = index
            break

    if matching_index is not None:
        existing_id = signals[matching_index].get("id")
        updated_signal = normalize_bot_signal(bot_signal, existing_id=existing_id)
        signals[matching_index] = updated_signal
        action = "replaced existing signal"
    else:
        new_id = get_next_id(signals)
        updated_signal = normalize_bot_signal(bot_signal, existing_id=new_id)
        signals.insert(0, updated_signal)
        action = "added new signal"

    save_json(SIGNALS_FILE, signals)

    print("✅ Latest bot signal imported successfully.")
    print(f"Action: {action}")
    print(f"Symbol: {updated_signal['symbol']}")
    print(f"Direction: {updated_signal['direction']}")
    print(f"Confidence: {updated_signal['confidence']}%")
    print(f"Risk: {updated_signal['risk']}")
    print(f"ID: {updated_signal['id']}")
    print("")
    print("Open the Dashboard or History page to see the imported signal.")
    print("Educational demo only. Not financial advice.")


if __name__ == "__main__":
    main()