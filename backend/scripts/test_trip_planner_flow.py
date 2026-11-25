import urllib.request
import urllib.error
import json
import time

print("=== WAYNEX AI TRIP PLANNER VERIFICATION ===")

# Test 1: Frontend Route /trips
print("\n[1] Testing Frontend Route /trips...")
req = urllib.request.Request("http://localhost:3000/trips", headers={"User-Agent": "WAYNEX-Test/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Status: {resp.status} OK (Size: {len(resp.read()) / 1024:.1f} KB)")
except Exception as e:
    print(f"FAIL: {e}")

# Test 2: Backend API GET /api/v1/budget/trips/
print("\n[2] Testing Backend API GET /api/v1/budget/trips/...")
req = urllib.request.Request("http://127.0.0.1:8000/api/v1/budget/trips/", headers={"User-Agent": "WAYNEX-Test/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Status: {resp.status} OK (Total existing trips: {len(data)})")
except Exception as e:
    print(f"FAIL: {e}")

# Test 3: Backend API POST /api/v1/budget/trips/ (Create a planned trip)
print("\n[3] Testing Backend API POST /api/v1/budget/trips/ (Mysuru 2-Day Plan)...")
payload = {
    "title": "Mysuru 2-Day Heritage & Scenic Expedition",
    "destination_city": "Mysuru",
    "departure_city": "Bengaluru",
    "duration_days": 2,
    "budget_amount": 8000.0,
    "budget_type": "per_person",
    "traveller_type": "friends",
    "adults_count": 2,
    "children_count": 0,
    "transport_mode": "bus",
    "accommodation_type": "budget_hotel",
    "status": "saved",
    "selected_places": [
        "Mysore Palace (Amba Vilas)",
        "Chamundeshwari Temple & Nandi Monolith",
        "Brindavan Gardens & Musical Fountains",
        "Sri Chamarajendra Zoological Gardens (Mysuru Zoo)",
        "St. Philomena’s Neo-Gothic Cathedral"
    ],
    "expense_breakdown": {
        "transport": 1760,
        "accommodation": 2560,
        "food": 1600,
        "localTransit": 800,
        "attractionFees": 480,
        "activities": 400,
        "emergencyReserve": 400
    },
    "itinerary_data": {
        "summary": "Bengaluru to Mysuru 2-Day Friends Expedition",
        "days": [
            {
                "dayNumber": 1,
                "theme": "Mysuru Heritage & Iconic Landmarks",
                "morning": ["Depart Bengaluru via KSRTC Airavat", "Hotel check-in at Ginger Hotel", "Breakfast at Vinayaka Mylari", "Visit Mysore Palace"],
                "afternoon": ["Lunch at Hotel RRR (Banana Leaf Meals)", "St. Philomena’s Cathedral", "Mysuru Zoo"],
                "evening": ["Guru Sweet Mart Mysore Pak", "Dinner at Gufha Cave Restaurant", "Rest at Hotel"]
            },
            {
                "dayNumber": 2,
                "theme": "Panoramic Nature & Scenic Heights",
                "morning": ["Breakfast", "Chamundi Hills & Nandi Monolith", "Karanji Lake Aviary"],
                "afternoon": ["Lunch", "Jaganmohan Palace Art Gallery"],
                "evening": ["Brindavan Gardens KRS Dam Musical Fountains", "Return Bus to Bengaluru"]
            }
        ]
    }
}

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/v1/budget/trips/",
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json", "User-Agent": "WAYNEX-Test/1.0"}
)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        created = json.loads(resp.read().decode('utf-8'))
        print(f"Status: {resp.status} CREATED!")
        print(f"Created Trip ID: {created.get('id')}")
        print(f"Title: {created.get('title')}")
        print(f"Places: {len(created.get('selected_places', []))} places saved")
except Exception as e:
    print(f"FAIL: {e}")

print("\n=== VERIFICATION COMPLETE ===")
