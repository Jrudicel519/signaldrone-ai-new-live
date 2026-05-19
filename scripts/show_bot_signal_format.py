import json
from pathlib import Path

TEMPLATE_FILE = Path("bot_output/signal_template.json")

def main():
    if not TEMPLATE_FILE.exists():
        print("Template file not found.")
        print("Expected: bot_output/signal_template.json")
        return

    with TEMPLATE_FILE.open("r", encoding="utf-8") as file:
        template = json.load(file)

    print("Required bot signal format:")
    print()
    print(json.dumps(template, indent=2))
    print()
    print("Allowed direction values: Bullish, Bearish, Neutral")
    print("Allowed risk values: Low, Medium, High")
    print("Confidence must be a whole number from 0 to 100.")
    print("Educational market research only. Not financial advice.")

if __name__ == "__main__":
    main()
