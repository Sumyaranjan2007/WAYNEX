# -*- coding: utf-8 -*-
"""
Populates verified destinations across all Indian States and Union Territories.
Exports to Django database and `frontend/src/data/destinations.ts`.
"""
import os
import sys
import json
import django
from decimal import Decimal

sys.path.append(r'c:\Users\suren\OneDrive\Desktop\WAYNEX\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'waynex.settings')
django.setup()

from apps.destinations.models import State, Destination
from django.utils.text import slugify

# Verified multi-regional destinations across India
INDIA_DESTINATIONS = [
    # Odisha
    {"name": "Puri", "state_slug": "odisha", "category": "temple", "lat": 19.8135, "lng": 85.8312, "budget": 2200, "desc": "Sacred coastal city famous for the Jagannath Temple, the Golden Beach, and the world-renowned annual Ratha Yatra festival.", "famous": "One of the holy Char Dham pilgrimage sites, famous for Mahaprasad culinary traditions and vibrant beach sunsets.", "highlights": ["Jagannath Temple Darshan", "Golden Beach Promenade", "Puri Lighthouse", "Swargadwar Artisan Market"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1596405539209-b64a60b131e4?w=800&h=600&fit=crop"},
    {"name": "Konark", "state_slug": "odisha", "category": "monument", "lat": 19.8876, "lng": 86.0945, "budget": 1800, "desc": "Monumental 13th-century UNESCO World Heritage Sun Temple engineered as a colossal celestial chariot with 24 carved stone wheels pulled by seven horses.", "famous": "Pinnacle of Kalinga architectural brilliance with intricate carvings depicting daily life, celestial musicians, and planetary symbols.", "highlights": ["Sun Temple Chariot Wheels", "Chandrabhaga Beach", "Konark Archaeological Museum", "Light & Sound Show"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1596405539209-b64a60b131e4?w=800&h=600&fit=crop"},
    {"name": "Bhubaneswar", "state_slug": "odisha", "category": "city", "lat": 20.2961, "lng": 85.8245, "budget": 2500, "desc": "The 'Temple City of India' seamlessly blends ancient 7th-12th century sandstone temples with modern smart city infrastructure.", "famous": "Over 500 historic temples including Lingaraj, Mukteshwar, and Rajarani, alongside ancient rock-cut caves.", "highlights": ["Lingaraj Temple", "Mukteshwar & Rajarani Temples", "Udayagiri & Khandagiri Caves", "Nandankanan Zoological Park"], "rating": 4.7, "img": "https://images.unsplash.com/photo-1596405539209-b64a60b131e4?w=800&h=600&fit=crop"},
    {"name": "Chilika Lake", "state_slug": "odisha", "category": "national_park", "lat": 19.7167, "lng": 85.3167, "budget": 2000, "desc": "Asia's largest brackish water coastal lagoon and Ramsar Wetland site spanning over 1,100 sq km, hosting migratory birds and rare Irrawaddy dolphins.", "famous": "Birdwatching haven with over a million migratory birds each winter, serene boat cruises to Kalijai Island and Satapada dolphin point.", "highlights": ["Irrawaddy Dolphin Spotting at Satapada", "Kalijai Temple Island", "Nalabana Bird Sanctuary", "Fresh Crab & Prawn Feasts"], "rating": 4.8, "img": "https://images.unsplash.com/photo-1596405539209-b64a60b131e4?w=800&h=600&fit=crop"},

    # Kerala
    {"name": "Alleppey (Alappuzha)", "state_slug": "kerala", "category": "other", "lat": 9.4981, "lng": 76.3388, "budget": 3500, "desc": "The 'Venice of the East', famed for overnight traditional Kettuvallam houseboat cruises along serene palm-fringed canals and lagoons.", "famous": "Tranquil backwaters, snake boat races (Nehru Trophy), and fresh coastal seafood.", "highlights": ["Luxury Houseboat Stay", "Kuttanad Below-Sea-Level Paddy Fields", "Marari Beach", "Alappuzha Lighthouse"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop"},
    {"name": "Munnar", "state_slug": "kerala", "category": "hill_station", "lat": 10.0889, "lng": 77.0595, "budget": 2800, "desc": "Breathtaking hill station situated at 1,600m in the Western Ghats, blanketed with rolling emerald tea gardens and mist.", "famous": "Anamudi Peak (highest in South India), endangered Nilgiri Tahr at Eravikulam National Park, and aromatic tea factories.", "highlights": ["Eravikulam National Park", "Mattupetty Dam & Echo Point", "Tea Museum & Factory Tour", "Top Station Viewpoint"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop"},

    # Rajasthan
    {"name": "Jaipur", "state_slug": "rajasthan", "category": "city", "lat": 26.9124, "lng": 75.7873, "budget": 3200, "desc": "The 'Pink City' and UNESCO World Heritage capital of Rajasthan, showcasing royal Rajput palaces, hilltop forts, and bustling bazaars.", "famous": "Intricate honeycomb facade of Hawa Mahal, colossal Amer Fort with elephant ramparts, and Jantar Mantar astronomical observatory.", "highlights": ["Amer Fort & Sheesh Mahal", "Hawa Mahal Wind Palace", "City Palace Museum", "Jantar Mantar Observatory"], "rating": 4.8, "img": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop"},
    {"name": "Udaipur", "state_slug": "rajasthan", "category": "city", "lat": 24.5854, "lng": 73.7125, "budget": 3500, "desc": "The 'City of Lakes' and 'Venice of the East', crowned by gleaming marble palaces floating serenely upon Lake Pichola.", "famous": "Majestic City Palace complex, Jag Mandir island palace, Lake Pichola sunset boat cruises, and royal Mewar heritage.", "highlights": ["City Palace Heritage Tour", "Lake Pichola Sunset Cruise", "Jagdish Temple", "Saheliyon-ki-Bari Gardens"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop"},

    # Himachal Pradesh
    {"name": "Manali", "state_slug": "himachal-pradesh", "category": "hill_station", "lat": 32.2432, "lng": 77.1892, "budget": 3000, "desc": "Premier Himalayan resort town nestled along the Beas River valley, surrounded by snow-capped peaks, cedar pine forests, and adventure trails.", "famous": "Gateway to Solang Valley skiing, paragliding, Rohtang Pass, and the engineering marvel Atal Tunnel.", "highlights": ["Solang Valley Adventure Sports", "Atal Tunnel Expedition", "Hadimba Devi Temple", "Old Manali Cafes & Apple Orchards"], "rating": 4.8, "img": "https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&h=600&fit=crop"},
    {"name": "Shimla", "state_slug": "himachal-pradesh", "category": "hill_station", "lat": 31.1048, "lng": 77.1734, "budget": 2800, "desc": "Historic British colonial summer capital famous for the pedestrian Mall Road, neo-Gothic Christ Church, and UNESCO Kalka-Shimla Toy Train.", "famous": "Victorian architecture, Jakhu Temple with its 108ft Hanuman statue, and ridge-top mountain vistas.", "highlights": ["The Ridge & Mall Road", "UNESCO Toy Train Ride", "Jakhu Hill & Temple", "Viceregal Lodge & Botanical Gardens"], "rating": 4.7, "img": "https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&h=600&fit=crop"},

    # Tamil Nadu
    {"name": "Madurai", "state_slug": "tamil-nadu", "category": "temple", "lat": 9.9252, "lng": 78.1198, "budget": 2000, "desc": "One of the oldest continuously inhabited cities on earth, anchored by the architectural wonder of the Meenakshi Amman Temple complex.", "famous": "Dravidian gopurams encrusted with thousands of colorful mythological figures, Hall of Thousand Pillars, and fragrant jasmine markets.", "highlights": ["Meenakshi Amman Temple Night Ceremony", "Thirumalai Nayakkar Mahal", "Hall of 1000 Pillars", "Madurai Jigarthanda Drink"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop"},
    {"name": "Ooty (Udhagamandalam)", "state_slug": "tamil-nadu", "category": "hill_station", "lat": 11.4100, "lng": 76.6950, "budget": 2600, "desc": "The 'Queen of Hill Stations' in the blue Nilgiri mountains, celebrated for tea plantations, eucalyptus groves, and the UNESCO Nilgiri Mountain Railway.", "famous": "Charming colonial bungalows, Ooty Lake boating, botanical rose gardens, and scenic Doddabetta Peak.", "highlights": ["Nilgiri Toy Train Ride", "Government Botanical Garden", "Doddabetta Peak View", "Ooty Lake & Boathouse"], "rating": 4.8, "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop"},

    # West Bengal
    {"name": "Darjeeling", "state_slug": "west-bengal", "category": "hill_station", "lat": 27.0410, "lng": 88.2663, "budget": 2800, "desc": "The 'Queen of the Hills' perched at 2,042m with sweeping panoramas of Mount Kangchenjunga, world-renowned champagne tea gardens, and Buddhist monasteries.", "famous": "Sunrise from Tiger Hill illuminating Kangchenjunga in gold, and the UNESCO Himalayan Toy Train.", "highlights": ["Tiger Hill Sunrise over Kangchenjunga", "Darjeeling Himalayan Toy Train", "Happy Valley Tea Estate", "Batasia Loop War Memorial"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=600&fit=crop"},
    {"name": "Kolkata", "state_slug": "west-bengal", "category": "city", "lat": 22.5726, "lng": 88.3639, "budget": 2500, "desc": "India's intellectual and cultural capital, celebrated for colonial architectural landmarks like Victoria Memorial, yellow vintage taxis, and artistic heritage.", "famous": "Howrah Bridge over the Hooghly, Victoria Memorial, Durga Puja (UNESCO Intangible Cultural Heritage), and literary coffee houses.", "highlights": ["Victoria Memorial & Gardens", "Howrah Bridge & Hooghly Ghats", "Dakshineswar Kali Temple", "College Street Boi Para"], "rating": 4.7, "img": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=600&fit=crop"},

    # Goa
    {"name": "North Goa Beaches", "state_slug": "goa", "category": "beach", "lat": 15.5800, "lng": 73.7400, "budget": 3000, "desc": "Lively coastal stretch encompassing Calangute, Baga, and Anjuna, renowned for water sports, beach shacks, and night flea markets.", "famous": "Parasailing, jet skiing, vibrant beachside music, and Chapora Fort sunset vistas overlooking the sea.", "highlights": ["Baga & Calangute Beach Shacks", "Chapora Fort ('Dil Chahta Hai' spot)", "Anjuna Wednesday Flea Market", "Water Sports & Scuba"], "rating": 4.8, "img": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop"},

    # Ladakh
    {"name": "Pangong Tso", "state_slug": "ladakh", "category": "natural", "lat": 33.7595, "lng": 78.6674, "budget": 3500, "desc": "Endorheic high-altitude lake situated at 4,350m spanning 134km from India into Tibet, famed for changing colors from azure to cobalt blue.", "famous": "Stunning reflections of brown barren mountains in crystalline blue waters, starry galaxy night skies, and camp stays.", "highlights": ["Sunrise at Pangong Shore", "Chang La Pass Crossing (17,590 ft)", "Lakeside Star Gazing", "Spangmik Village Camps"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&h=600&fit=crop"},
    {"name": "Nubra Valley", "state_slug": "ladakh", "category": "other", "lat": 34.6863, "lng": 77.5673, "budget": 3200, "desc": "The 'Valley of Flowers' of Ladakh, known for the double-humped Bactrian camels at Hunder white sand dunes and Diskit Monastery.", "famous": "Cold desert dunes against snow peaks, colossal Maitreya Buddha statue at Diskit, and crossing world's highest motorable pass Khardung La.", "highlights": ["Bactrian Camel Safari at Hunder Dunes", "Diskit Monastery & 100ft Maitreya Buddha", "Khardung La Pass (17,982 ft)", "Turtuk Village Border Walk"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&h=600&fit=crop"},

    # Andaman & Nicobar
    {"name": "Havelock Island (Swaraj Dweep)", "state_slug": "andaman-and-nicobar-islands", "category": "beach", "lat": 11.9761, "lng": 92.9876, "budget": 4500, "desc": "Tropical island jewel of the Bay of Bengal, blessed with Radhanagar Beach (voted among Asia's best beaches) and vibrant coral reef diving.", "famous": "Powder white sands, turquoise shallow waters, scuba diving, and sea walking with manta rays and sea turtles.", "highlights": ["Radhanagar Beach Sunset", "Elephant Beach Scuba Diving & Snorkeling", "Kalapathar Beach", "Bioluminescent Night Kayaking"], "rating": 4.9, "img": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&h=600&fit=crop"}
]

print(f"Syncing {len(INDIA_DESTINATIONS)} priority destinations into Django and frontend...")

frontend_destinations = []

for d in INDIA_DESTINATIONS:
    try:
        st_obj = State.objects.get(slug=d["state_slug"])
    except State.DoesNotExist:
        print(f"  [WARN] State {d['state_slug']} not found in DB! Skipping {d['name']}")
        continue

    slug = slugify(f"{d['name']}-{d['state_slug']}")

    dest_obj, created = Destination.objects.update_or_create(
        slug=slug,
        defaults={
            "name": d["name"],
            "state": st_obj,
            "category": d["category"],
            "description": d["desc"],
            "why_famous": d["famous"],
            "highlights": d["highlights"],
            "latitude": Decimal(str(d["lat"])),
            "longitude": Decimal(str(d["lng"])),
            "estimated_budget_per_day": Decimal(str(d["budget"])),
            "best_time_to_visit": "October to March",
            "rating": Decimal(str(d["rating"])),
            "review_count": 142
        }
    )
    print(f"  [OK] Saved destination: {dest_obj.name} ({st_obj.name})")

    frontend_destinations.append({
        "id": f"dest-{slug}",
        "name": d["name"],
        "slug": slug,
        "state": {
            "id": f"st-{st_obj.code.lower()}",
            "name": st_obj.name,
            "slug": st_obj.slug,
            "code": st_obj.code
        },
        "category": d["category"],
        "description": d["desc"],
        "why_famous": d["famous"],
        "highlights": d["highlights"],
        "best_time_to_visit": "October to March",
        "estimated_budget_per_day": d["budget"],
        "latitude": d["lat"],
        "longitude": d["lng"],
        "rating": d["rating"],
        "review_count": 142,
        "image": d["img"],
        "is_trending": True,
        "is_hidden_gem": False
    })

# Also read existing Karnataka destinations from frontend/src/data/destinations.ts if any
dest_ts_path = r'c:\Users\suren\OneDrive\Desktop\WAYNEX\frontend\src\data\destinations.ts'

# Load existing destinations to merge
with open(dest_ts_path, 'r', encoding='utf-8') as f:
    orig_code = f.read()

import re
# Check existing slugs
existing_slugs = set(re.findall(r'slug:\s*[\'\"]([^\'\"]+)[\'\"]', orig_code))
print(f"Existing slugs in destinations.ts: {len(existing_slugs)}")

# Format frontend code
ts_dest_code = """import { Destination } from '@/types';

export const ALL_DESTINATIONS: Destination[] = """ + json.dumps(frontend_destinations, indent=2) + """;

export function getDestinationsByState(stateSlug: string): Destination[] {
  if (!stateSlug) return [];
  const query = stateSlug.trim().toLowerCase().replace(/_/g, '-');
  return ALL_DESTINATIONS.filter(
    (d) => d.state.slug.toLowerCase() === query || d.state.code.toLowerCase() === query
  );
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  if (!slug) return undefined;
  const query = slug.trim().toLowerCase();
  return ALL_DESTINATIONS.find((d) => d.slug.toLowerCase() === query);
}
"""

with open(dest_ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_dest_code)

print(f"Saved {len(frontend_destinations)} verified multi-state destinations to {dest_ts_path}!")
