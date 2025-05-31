from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import random
import threading
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# Initialize Gemini model for disease prediction and chat
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash")

# 🌿 Static rotating tips
raw_tips = """
General Plant Care Tips
Water plants early in the morning or late in the evening.
Always check soil moisture before watering.
Use well-draining soil to prevent root rot.
Fertilize during the growing season, not dormancy.
Rotate plants regularly for even light exposure.
Clean leaves to help plants photosynthesize better.
Use mulch to retain moisture and reduce weeds.
Remove dead or yellowing leaves promptly.
Choose pots with drainage holes.
Repot plants when root-bound.

Indoor Plant Care
Avoid placing plants near cold drafts or heaters.
Use a humidity tray for moisture-loving plants.
Wipe leaves with a damp cloth to remove dust.
Avoid overwatering—it's a common mistake.
Use grow lights in low-light areas.
Group plants to increase humidity.
Don’t let water sit in saucers.
Choose low-maintenance plants for beginners.
Let tap water sit 24 hours before watering.
Avoid sudden changes in light or temperature.

Outdoor Plant Care
Water deeply but infrequently to encourage deep roots.
Protect young plants from strong winds.
Prune regularly for healthy growth.
Plant at the right time of year for your climate.
Stake tall or heavy plants for support.
Keep garden tools clean to prevent disease spread.
Companion planting helps deter pests.
Use natural compost to enrich soil.
Apply fertilizer according to plant type.
Remove weeds regularly to reduce competition.

Container Gardening
Use potting mix, not garden soil.
Elevate pots for better drainage.
Re-pot every 1–2 years.
Choose the right container size for the plant.
Use saucers to protect floors but empty excess water.
Avoid dark-colored pots in hot climates—they absorb heat.
Don’t crowd plants in containers.
Add gravel or stones at the bottom for drainage.
Choose containers with UV protection for outdoor use.
Use slow-release fertilizer in containers.

Soil & Nutrient Tips
Test soil pH before planting.
Add organic matter to improve texture and fertility.
Rotate crops to maintain soil health.
Use compost tea for a nutrient boost.
Don’t over-fertilize—it can burn roots.
Sand can improve drainage in clay soils.
Use cover crops in off-seasons to replenish soil.
Keep soil covered to prevent erosion.
Mix in worm castings for better soil biology.
Adjust watering based on soil type.

Pests & Disease Management
Inspect leaves (top and bottom) weekly.
Quarantine new plants before adding to the collection.
Neem oil is a natural pesticide.
Soap sprays can control soft-bodied insects.
Remove affected leaves to prevent disease spread.
Use sticky traps for monitoring flying pests.
Avoid overhead watering to reduce fungal issues.
Attract beneficial insects like ladybugs.
Don’t reuse old soil that may harbor pests.
Improve air circulation to deter mold and mildew.

Seasonal Care
Reduce watering in winter.
Protect frost-sensitive plants with covers.
Transition plants slowly between indoors/outdoors.
Deadhead flowers to encourage new blooms.
Divide perennials in spring or fall.
Plant bulbs in fall for spring blooms.
Adjust feeding schedules seasonally.
Move tropical plants indoors before frost.
Prune in late winter for spring growth.
Harvest herbs before flowering for best flavor.

Light & Temperature Tips
Know your plant’s light requirements.
Use sheer curtains to filter harsh sunlight.
Keep tropical plants in warm, stable temperatures.
Avoid placing plants on cold windowsills.
South-facing windows give the most light.
Rotate plants monthly for even growth.
Supplemental lighting helps in winter months.
Don’t place plants directly under AC vents.
Heat mats help germinate seeds in cold areas.
Use light meters for precise light readings.

Propagation & Growth
Use sharp tools for clean cuttings.
Propagate with water or soil depending on the plant.
Keep cuttings humid for better rooting.
Don’t disturb seeds once sown.
Label seedlings to track progress.
Use rooting hormone for tougher cuttings.
Space seedlings to avoid overcrowding.
Harden off seedlings before transplanting outdoors.
Start seeds in sterile mix to prevent damping-off.
Pinch stems to encourage bushier growth.

Eco-Friendly Practices
Reuse rainwater for watering plants.
Compost kitchen scraps for your garden.
Avoid chemical pesticides and fertilizers.
Choose native plants—they’re easier to maintain.
Encourage pollinators with diverse blooms.
Recycle containers for plant pots.
Grow your own herbs and veggies.
Choose drought-tolerant species for dry areas.
Use greywater systems responsibly.
Share plant cuttings with friends to reduce waste.
"""

# Parse tips into (category, tip) tuples
all_tips = []
current_category = ""
for line in raw_tips.strip().split("\n"):
    line = line.strip()
    if not line:
        continue
    if not line.endswith("."):
        current_category = line
    else:
        all_tips.append((current_category, line))

current_tip = random.choice(all_tips)

def rotate_tip():
    global current_tip
    while True:
        current_tip = random.choice(all_tips)
        time.sleep(30)

threading.Thread(target=rotate_tip, daemon=True).start()

@app.route("/api/plant-tips", methods=["GET"])
def get_plant_tip():
    category, tip = current_tip
    emoji_map = {
        "General Plant Care Tips": "🪴",
        "Indoor Plant Care": "🏠",
        "Outdoor Plant Care": "🌳",
        "Container Gardening": "🧺",
        "Soil & Nutrient Tips": "🌱",
        "Pests & Disease Management": "🐛",
        "Seasonal Care": "🍂",
        "Light & Temperature Tips": "🌞",
        "Propagation & Growth": "🌿",
        "Eco-Friendly Practices": "♻️"
    }
    emoji = emoji_map.get(category, "🌿")
    tip_md = f"**{emoji} {category}**: {tip}"
    return jsonify({
        "tip": tip_md,
        "source": "Predefined Plant Tips"
    })

@app.route("/api/plant-tips/all", methods=["GET"])
def get_all_tips():
    emoji_map = {
        "General Plant Care Tips": "🪴",
        "Indoor Plant Care": "🏠",
        "Outdoor Plant Care": "🌳",
        "Container Gardening": "🧺",
        "Soil & Nutrient Tips": "🌱",
        "Pests & Disease Management": "🐛",
        "Seasonal Care": "🍂",
        "Light & Temperature Tips": "🌞",
        "Propagation & Growth": "🌿",
        "Eco-Friendly Practices": "♻️"
    }

    tips_list = []
    for category, tip in all_tips:
        emoji = emoji_map.get(category, "🌿")
        tip_md = f"**{emoji} {category}**: {tip}"
        tips_list.append({"tip": tip_md, "source": "Predefined Plant Tips"})

    return jsonify(tips_list)

@app.route("/predict", methods=["POST"])
def predict_disease():
    try:
        file = request.files["file"]
        image_bytes = file.read()
        response = model.generate_content([
            "Analyze this plant disease. Provide:",
            "1. Disease name (confidence)",
            "2. Organic treatment",
            "3. Prevention tips",
            {"mime_type": file.mimetype, "data": base64.b64encode(image_bytes).decode("utf-8")}
        ])
        return jsonify({
            "analysis": response.text,
            "model_used": "gemini-2.0-flash"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat_with_gemini():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        memory = data.get("memory", [])

        if not user_message.strip():
            return jsonify({"error": "Empty message"}), 400

        prompt_parts = [
            "You are PlantBot, an expert in plants, gardening, and botany. "
            "Answer user questions clearly and helpfully. "
            "If the question is not about plants, gardening, or soil, politely redirect the user."
        ]

        if isinstance(memory, list) and memory:
            for m in memory:
                role = m.get("role", "user")
                content = m.get("content", "")
                if role == "user":
                    prompt_parts.append(f"User: {content}")
                else:
                    prompt_parts.append(f"Bot: {content}")

        prompt_parts.append(f"User: {user_message}")

        response = model.generate_content(prompt_parts)
        bot_reply = response.text

        return jsonify({"reply": bot_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
