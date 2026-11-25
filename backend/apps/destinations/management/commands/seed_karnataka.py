"""
Management command to seed all 28 Indian States + 8 Union Territories,
with complete rich details for Karnataka, its districts, and 15 pilot destinations.
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.destinations.models import State, District, Destination, Attraction, DestinationMedia


class Command(BaseCommand):
    help = 'Seeds all 28 Indian States + 8 UTs and pilot Karnataka destinations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting seed process for WAYNEX destinations...'))
        self.seed_states_and_uts()
        self.enrich_karnataka()
        districts = self.seed_districts()
        self.seed_pilot_destinations(districts)
        self.stdout.write(self.style.SUCCESS('Successfully completed database seeding!'))

    def seed_states_and_uts(self):
        """Seed all 28 states and 8 Union Territories of India with real capitals and codes."""
        states_data = [
            # 28 States
            {"name": "Andhra Pradesh", "code": "AP", "capital": "Amaravati", "is_ut": False},
            {"name": "Arunachal Pradesh", "code": "AR", "capital": "Itanagar", "is_ut": False},
            {"name": "Assam", "code": "AS", "capital": "Dispur", "is_ut": False},
            {"name": "Bihar", "code": "BR", "capital": "Patna", "is_ut": False},
            {"name": "Chhattisgarh", "code": "CG", "capital": "Raipur", "is_ut": False},
            {"name": "Goa", "code": "GA", "capital": "Panaji", "is_ut": False},
            {"name": "Gujarat", "code": "GJ", "capital": "Gandhinagar", "is_ut": False},
            {"name": "Haryana", "code": "HR", "capital": "Chandigarh", "is_ut": False},
            {"name": "Himachal Pradesh", "code": "HP", "capital": "Shimla", "is_ut": False},
            {"name": "Jharkhand", "code": "JH", "capital": "Ranchi", "is_ut": False},
            {"name": "Karnataka", "code": "KA", "capital": "Bengaluru", "is_ut": False},
            {"name": "Kerala", "code": "KL", "capital": "Thiruvananthapuram", "is_ut": False},
            {"name": "Madhya Pradesh", "code": "MP", "capital": "Bhopal", "is_ut": False},
            {"name": "Maharashtra", "code": "MH", "capital": "Mumbai", "is_ut": False},
            {"name": "Manipur", "code": "MN", "capital": "Imphal", "is_ut": False},
            {"name": "Meghalaya", "code": "ML", "capital": "Shillong", "is_ut": False},
            {"name": "Mizoram", "code": "MZ", "capital": "Aizawl", "is_ut": False},
            {"name": "Nagaland", "code": "NL", "capital": "Kohima", "is_ut": False},
            {"name": "Odisha", "code": "OD", "capital": "Bhubaneswar", "is_ut": False},
            {"name": "Punjab", "code": "PB", "capital": "Chandigarh", "is_ut": False},
            {"name": "Rajasthan", "code": "RJ", "capital": "Jaipur", "is_ut": False},
            {"name": "Sikkim", "code": "SK", "capital": "Gangtok", "is_ut": False},
            {"name": "Tamil Nadu", "code": "TN", "capital": "Chennai", "is_ut": False},
            {"name": "Telangana", "code": "TG", "capital": "Hyderabad", "is_ut": False},
            {"name": "Tripura", "code": "TR", "capital": "Agartala", "is_ut": False},
            {"name": "Uttar Pradesh", "code": "UP", "capital": "Lucknow", "is_ut": False},
            {"name": "Uttarakhand", "code": "UK", "capital": "Dehradun", "is_ut": False},
            {"name": "West Bengal", "code": "WB", "capital": "Kolkata", "is_ut": False},
            # 8 Union Territories
            {"name": "Andaman and Nicobar Islands", "code": "AN", "capital": "Port Blair", "is_ut": True},
            {"name": "Chandigarh", "code": "CH", "capital": "Chandigarh", "is_ut": True},
            {"name": "Dadra and Nagar Haveli and Daman and Diu", "code": "DN", "capital": "Daman", "is_ut": True},
            {"name": "Delhi", "code": "DL", "capital": "New Delhi", "is_ut": True},
            {"name": "Jammu and Kashmir", "code": "JK", "capital": "Srinagar", "is_ut": True},
            {"name": "Ladakh", "code": "LA", "capital": "Leh", "is_ut": True},
            {"name": "Lakshadweep", "code": "LD", "capital": "Kavaratti", "is_ut": True},
            {"name": "Puducherry", "code": "PY", "capital": "Puducherry", "is_ut": True},
        ]

        created_count = 0
        for item in states_data:
            state, created = State.objects.update_or_create(
                code=item["code"],
                defaults={
                    "name": item["name"],
                    "slug": slugify(item["name"]),
                    "capital": item["capital"],
                    "is_union_territory": item["is_ut"],
                }
            )
            if created:
                created_count += 1

        self.stdout.write(f'Seeded {len(states_data)} States & UTs ({created_count} newly created).')

    def enrich_karnataka(self):
        """Update Karnataka with rich cultural, geographical, and historical data."""
        State.objects.filter(code='KA').update(
            description=(
                "Karnataka, located in southwest India with Arabian Sea coastlines, is renowned for its "
                "vibrant tech hub Bengaluru, opulent palaces in Mysuru, ancient Vijayanagara ruins at Hampi, "
                "lush coffee-clad Western Ghats, and pristine coastal beaches."
            ),
            history=(
                "Ruled by illustrious dynasties including the Kadambas, Chalukyas, Rashtrakutas, Hoysalas, "
                "and the Vijayanagara Empire. The state was originally known as the State of Mysore and renamed "
                "Karnataka in 1973, derived from 'Karu-nadu' meaning elevated land."
            ),
            geography=(
                "Covers the Deccan Plateau, Western Ghats (Sahyadris), and the coastal plains of Karavali. "
                "Drained by major river systems including Krishna, Cauvery, Tungabhadra, and Sharavathi."
            ),
            climate="Tropical monsoon climate; pleasant winters from October to March, hot summers from March to May, and monsoon from June to September.",
            best_time_to_visit="October to March",
            languages="Kannada, Tulu, Kodava, Konkani, Urdu, English",
            latitude=Decimal("15.3173"),
            longitude=Decimal("75.7139"),
        )
        self.stdout.write('Enriched Karnataka state with full cultural & geographic profile.')

    def seed_districts(self):
        """Seed key Karnataka districts."""
        karnataka = State.objects.get(code='KA')
        districts_data = [
            {"name": "Bengaluru Urban", "hq": "Bengaluru", "desc": "Capital district and tech hub of Karnataka."},
            {"name": "Mysuru", "hq": "Mysuru", "desc": "Cultural capital with royal palaces and silk heritage."},
            {"name": "Vijayanagara", "hq": "Hosapete", "desc": "Historic heartland housing UNESCO Hampi monuments."},
            {"name": "Kodagu", "hq": "Madikeri", "desc": "Picturesque hill country known for coffee, spice, and Kodava culture."},
            {"name": "Uttara Kannada", "hq": "Karwar", "desc": "Forested coastal district featuring Gokarna and Dandeli."},
            {"name": "Chikkamagaluru", "hq": "Chikkamagaluru", "desc": "Birthplace of Indian coffee in the Baba Budan hills."},
            {"name": "Shivamogga", "hq": "Shivamogga", "desc": "Lush Malenadu gateway to spectacular Jog Falls."},
            {"name": "Udupi", "hq": "Udupi", "desc": "Coastal hub famed for Sri Krishna Temple and pristine beaches."},
            {"name": "Dakshina Kannada", "hq": "Mangaluru", "desc": "Commercial coastal district celebrated for temples and cuisine."},
            {"name": "Bagalkote", "hq": "Bagalkote", "desc": "Chalukya heritage cradle home to Badami cave temples."},
            {"name": "Hassan", "hq": "Hassan", "desc": "Architectural capital of Hoysala marvels Belur and Halebidu."},
        ]

        district_map = {}
        for d in districts_data:
            obj, _ = District.objects.update_or_create(
                name=d["name"],
                state=karnataka,
                defaults={
                    "slug": slugify(f"{d['name']}-karnataka"),
                    "headquarters": d["hq"],
                    "description": d["desc"],
                }
            )
            district_map[d["name"]] = obj

        self.stdout.write(f'Seeded {len(districts_data)} Karnataka districts.')
        return district_map

    def seed_pilot_destinations(self, districts):
        """Seed the 15 pilot Karnataka destinations with real accurate coordinates and info."""
        karnataka = State.objects.get(code='KA')

        destinations_info = [
            {
                "name": "Bengaluru",
                "district": districts.get("Bengaluru Urban"),
                "category": "city",
                "lat": Decimal("12.9716"),
                "lng": Decimal("77.5946"),
                "description": "The dynamic capital of Karnataka and India's leading technology hub, Bengaluru harmoniously balances gleaming modern IT corridors with sprawling verdant colonial-era parks.",
                "history": "Founded by Kempe Gowda I in 1537 as a mud fort, later fortified by Hyder Ali and Tipu Sultan before becoming a major British administrative cantonment.",
                "why_famous": "Known globally as the Silicon Valley of India and the Garden City, famous for pleasant weather, craft beer culture, and historic botanical gardens.",
                "highlights": ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "Vidhana Soudha", "Indiranagar Craft Breweries"],
                "best_time_to_visit": "October to February",
                "weather_info": "Moderate climate throughout the year; temperatures average 15°C - 32°C.",
                "local_food": ["Masala Dosa at Vidyarthi Bhavan", "Bisi Bele Bath", "Filter Coffee", "Mysore Pak"],
                "culture": "Cosmopolitan tech ethos enriched with traditional Kannada classical music and theatre (Ranga Shankara).",
                "festivals": ["Bengaluru Karaga", "Kadalekai Parishe", "Bangalore Literature Festival"],
                "safety_info": "Safe for solo travelers and female tourists; active night transport and emergency 112 support.",
                "accessibility": "Kempegowda International Airport (BLR), Bengaluru City (SBC) and Yesvantpur railway stations, Namma Metro network.",
                "estimated_budget_per_day": Decimal("2500.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.6"),
                "review_count": 1250,
                "attractions": [
                    {"name": "Lalbagh Botanical Garden", "category": "natural", "fee": Decimal("30.00"), "hours": "6:00 AM - 7:00 PM", "duration": "2 hours", "lat": Decimal("12.9507"), "lng": Decimal("77.5848")},
                    {"name": "Cubbon Park", "category": "natural", "fee": Decimal("0.00"), "hours": "6:00 AM - 6:00 PM", "duration": "2 hours", "lat": Decimal("12.9763"), "lng": Decimal("77.5929")},
                    {"name": "Bangalore Palace", "category": "historical", "fee": Decimal("250.00"), "hours": "10:00 AM - 5:30 PM", "duration": "2.5 hours", "lat": Decimal("12.9988"), "lng": Decimal("77.5921")},
                ]
            },
            {
                "name": "Mysuru",
                "district": districts.get("Mysuru"),
                "category": "heritage_site",
                "lat": Decimal("12.2958"),
                "lng": Decimal("76.6394"),
                "description": "The cultural capital of Karnataka, Mysuru is globally celebrated for its majestic Indo-Saracenic royal palace, heritage sandalwood industries, and vibrant annual Dasara festivities.",
                "history": "Capital of the Kingdom of Mysore under the Wodeyar dynasty for nearly six centuries (1399-1947), flourishing as a beacon of South Indian art, architecture, and music.",
                "why_famous": "Grand Mysore Palace, Mysore Silk, Mysore Sandal Soap, authentic Ashtanga Yoga centres, and grand 10-day Dasara procession.",
                "highlights": ["Mysore Palace illumination", "Chamundeshwari Temple atop Chamundi Hills", "Brindavan Gardens", "St. Philomena's Cathedral"],
                "best_time_to_visit": "October to March (especially during Dasara in Oct)",
                "weather_info": "Warm tropical climate; winter ranges between 16°C and 30°C.",
                "local_food": ["Mysore Masala Dosa", "Mysore Pak sweets", "Rava Idli", "Mysore Rasam"],
                "culture": "Rich classical Carnatic traditions, traditional painting styles, and royal ceremonial heritage.",
                "festivals": ["Mysuru Dasara", "Vairamudi Brahmotsava", "Ugadi"],
                "safety_info": "Very peaceful, pedestrian-friendly city with low crime rate and helpful tourist police.",
                "accessibility": "Mysuru Airport (MYQ) and Mysore Junction (MYS) with Vande Bharat connections from Bengaluru.",
                "estimated_budget_per_day": Decimal("1800.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.8"),
                "review_count": 980,
                "attractions": [
                    {"name": "Mysore Palace", "category": "historical", "fee": Decimal("100.00"), "hours": "10:00 AM - 5:30 PM", "duration": "3 hours", "lat": Decimal("12.3051"), "lng": Decimal("76.6551")},
                    {"name": "Chamundi Hills & Temple", "category": "religious", "fee": Decimal("0.00"), "hours": "7:30 AM - 9:00 PM", "duration": "2 hours", "lat": Decimal("12.2753"), "lng": Decimal("76.6713")},
                ]
            },
            {
                "name": "Hampi",
                "district": districts.get("Vijayanagara"),
                "category": "heritage_site",
                "lat": Decimal("15.3350"),
                "lng": Decimal("76.4620"),
                "description": "An awe-inspiring UNESCO World Heritage Site, Hampi displays the sprawling granite-hewn ruins of the 14th-century Vijayanagara Empire along the banks of the Tungabhadra River.",
                "history": "Flourished between 1336 and 1565 as the imperial capital of the Vijayanagara Empire, once counted among the richest and largest cities in the medieval world.",
                "why_famous": "Iconic Stone Chariot, musical stone pillars at Vijaya Vittala Temple, Virupaksha Temple, and otherworldly boulder-strewn terrain.",
                "highlights": ["Vijaya Vittala Temple Complex", "Virupaksha Temple", "Matanga Hill sunrise", "Queen's Bath & Lotus Mahal"],
                "best_time_to_visit": "October to February",
                "weather_info": "Semi-arid climate; winters are pleasant (15°C - 30°C), summers are scorching (up to 42°C).",
                "local_food": ["South Indian Banana Leaf Meals", "Jolada Rotti Meals", "Mediterranean cafes in Hippie Island"],
                "culture": "Spiritual, architectural, and bohemian backpacker culture with temple rituals ongoing for over 700 years.",
                "festivals": ["Hampi Utsav (November)", "Purandaradasa Aradhana", "Virupaksha Chariot Festival"],
                "safety_info": "Safe rural area; hire registered ASI tour guides and carry hydration during monument walks.",
                "accessibility": "Hosapete Junction (HPT) is 13 km away; Jindal Vijayanagar Airport (VDY) is 40 km away.",
                "estimated_budget_per_day": Decimal("1500.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.9"),
                "review_count": 1420,
                "attractions": [
                    {"name": "Vijaya Vittala Temple", "category": "historical", "fee": Decimal("40.00"), "hours": "8:30 AM - 5:30 PM", "duration": "3 hours", "lat": Decimal("15.3396"), "lng": Decimal("76.4789")},
                    {"name": "Virupaksha Temple", "category": "religious", "fee": Decimal("25.00"), "hours": "6:00 AM - 8:00 PM", "duration": "1.5 hours", "lat": Decimal("15.3358"), "lng": Decimal("76.4597")},
                ]
            },
            {
                "name": "Coorg",
                "district": districts.get("Kodagu"),
                "category": "hill_station",
                "lat": Decimal("12.3375"),
                "lng": Decimal("75.8069"),
                "description": "Widely known as the 'Scotland of India', Coorg (Kodagu) is a verdant mountainous district renowned for emerald coffee plantations, spice gardens, misty peaks, and distinctive martial Kodava traditions.",
                "history": "Ruled by the Haleri kings from 1600 to 1834, after which it was directly administered by the British before integrating into Karnataka in 1956.",
                "why_famous": "Pristine Arabica and Robusta coffee estates, cardamom hills, Abbey Falls, Namdroling Tibetan Golden Temple, and spicy Kodava culinary heritage.",
                "highlights": ["Abbey Falls", "Raja's Seat sunset point", "Namdroling Tibetan Monastery (Bylakuppe)", "Dubare Elephant Camp"],
                "best_time_to_visit": "October to April (or July-September for monsoon waterfalls)",
                "weather_info": "Subtropical highland climate with cool temperatures ranging from 11°C to 28°C.",
                "local_food": ["Pandi Curry (Coorg Pork)", "Kadambuttu (Steamed rice balls)", "Akki Rotti with Bamboo Shoot Curry", "Coorg Honey"],
                "culture": "Unique warrior culture of Kodavas, customary ethnic attire (Kupya and Chele), and traditional martial dances.",
                "festivals": ["Kailpodh (festival of weapons)", "Kaveri Sankramana", "Puttari (harvest)"],
                "safety_info": "Safe, warm homestay ecosystem. Caution advised when driving on narrow winding ghat roads during monsoon.",
                "accessibility": "Nearest railway station is Mysuru (120 km); Kannur International Airport (90 km) and Mangaluru Airport (140 km).",
                "estimated_budget_per_day": Decimal("2200.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.7"),
                "review_count": 890,
                "attractions": [
                    {"name": "Abbey Falls", "category": "natural", "fee": Decimal("15.00"), "hours": "9:00 AM - 5:00 PM", "duration": "1.5 hours", "lat": Decimal("12.4542"), "lng": Decimal("75.7183")},
                    {"name": "Raja's Seat", "category": "natural", "fee": Decimal("20.00"), "hours": "6:00 AM - 8:00 PM", "duration": "1 hour", "lat": Decimal("12.4222"), "lng": Decimal("75.7369")},
                ]
            },
            {
                "name": "Gokarna",
                "district": districts.get("Uttara Kannada"),
                "category": "beach",
                "lat": Decimal("14.5479"),
                "lng": Decimal("74.3188"),
                "description": "A coastal temple town where sacred Shaivite pilgrimage meets pristine Arabian Sea beaches; famous for the cliffside Om Beach, Kudle Beach, and the ancient Mahabaleshwar Temple.",
                "history": "Described in the Ramayana and Mahabharata; legend holds that Ravana brought the Atmalinga here, which became anchored firmly into the earth as Mahabaleshwar.",
                "why_famous": "Om Beach (shaped naturally like the sacred 'ॐ' symbol), Mahabaleshwar Atmalinga temple, yoga shalas, and unspoiled beach trekking trails.",
                "highlights": ["Om Beach", "Kudle Beach", "Half Moon Beach & Paradise Beach Trek", "Mahabaleshwar Temple"],
                "best_time_to_visit": "October to March",
                "weather_info": "Tropical coastal climate; breezy warm winters (19°C - 32°C), heavy monsoons (June-August).",
                "local_food": ["Fresh seafood thalis", "Nutritious Upma & Poha", "Woodfired pizzas & continental beach shack fare"],
                "culture": "Harmonious coexistence of orthodox Vedic chanting traditions and relaxed international beach backpacking.",
                "festivals": ["Maha Shivaratri (grand temple car procession)", "Kartik Poornima"],
                "safety_info": "Swim only in designated areas; heed red flags for strong undercurrents at Kudle and Om beaches.",
                "accessibility": "Gokarna Road railway station (GOK) 9 km; Dabolim Airport Goa (140 km); well connected by KSRTC buses.",
                "estimated_budget_per_day": Decimal("1400.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.6"),
                "review_count": 1120,
                "attractions": [
                    {"name": "Mahabaleshwar Temple", "category": "religious", "fee": Decimal("0.00"), "hours": "6:00 AM - 12:30 PM, 5:00 PM - 8:00 PM", "duration": "1.5 hours", "lat": Decimal("14.5428"), "lng": Decimal("74.3168")},
                    {"name": "Om Beach", "category": "natural", "fee": Decimal("0.00"), "hours": "24 Hours", "duration": "3 hours", "lat": Decimal("14.5186"), "lng": Decimal("74.3164")},
                ]
            },
            {
                "name": "Chikkamagaluru",
                "district": districts.get("Chikkamagaluru"),
                "category": "hill_station",
                "lat": Decimal("13.3153"),
                "lng": Decimal("75.7754"),
                "description": "Nestled in the foothills of the Baba Budan Giri range, Chikkamagaluru is the historical cradle of Indian coffee, crowned by Mullayanagiri, Karnataka's highest peak.",
                "history": "In 1670, Sufi saint Baba Budan smuggled seven raw coffee beans from Mocha, Yemen, and planted them on the slopes of Chandra Drona Parvatha.",
                "why_famous": "Birthplace of coffee in India, Mullayanagiri trek, scenic waterfalls like Hebbe and Jhari, and serene homestay retreats.",
                "highlights": ["Mullayanagiri Peak", "Baba Budan Giri shrine", "Hebbe Falls", "Coffee Museum"],
                "best_time_to_visit": "September to March",
                "weather_info": "Pleasant highland climate; 14°C to 28°C.",
                "local_food": ["Malgudi Filter Coffee", "Akki Rotti with Kaalu Huli", "Pathrode", "Kayirasa"],
                "culture": "Planter lifestyle interwoven with historical Sufi and Hindu syncretic traditions.",
                "festivals": ["Dattatreya Jayanti / Urs", "Coffee Blossom Festival (March-April)"],
                "safety_info": "Take licensed 4x4 jeeps to steep waterfalls like Hebbe and Jhari for safe off-road transit.",
                "accessibility": "Well-connected by road from Bengaluru (245 km); Kadur railway station is 40 km away.",
                "estimated_budget_per_day": Decimal("1900.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.7"),
                "review_count": 750,
                "attractions": [
                    {"name": "Mullayanagiri Peak", "category": "adventure", "fee": Decimal("0.00"), "hours": "6:00 AM - 6:00 PM", "duration": "3 hours", "lat": Decimal("13.3912"), "lng": Decimal("75.7214")},
                    {"name": "Baba Budan Giri", "category": "religious", "fee": Decimal("0.00"), "hours": "8:00 AM - 5:00 PM", "duration": "2 hours", "lat": Decimal("13.4214"), "lng": Decimal("75.7672")},
                ]
            },
            {
                "name": "Shivamogga",
                "district": districts.get("Shivamogga"),
                "category": "other",
                "lat": Decimal("13.9299"),
                "lng": Decimal("75.5681"),
                "description": "Known as the 'Gateway to Malenadu', Shivamogga is a verdant paradise crowned by rivers Tunga and Bhadra, thick Western Ghat forests, and heritage sanctuaries.",
                "history": "Ruled by the Keladi Nayakas (such as Shivappa Nayaka) who valiantly defended against regional sultans and fostered local agriculture.",
                "why_famous": "The gateway to the world-renowned Jog Falls, Tyavarekoppa Lion & Tiger Safari, and Mandagadde Bird Sanctuary.",
                "highlights": ["Gateway to Jog Falls", "Sakrebailu Elephant Camp", "Bhadra Wildlife Sanctuary", "Keladi Shivappa Nayaka Palace"],
                "best_time_to_visit": "October to March (July-October for full waterfall flow)",
                "weather_info": "Tropical wet and dry climate with heavy monsoon rainfall.",
                "local_food": ["Thotapuri Mango pickles", "Avalakki (beaten rice delicacies)", "Benne Dosa", "Halasina Hannu Papad (Jackfruit papad)"],
                "culture": "Deep literary legacy that nurtured Kannada giants like Rashtrakavi Kuvempu and U.R. Ananthamurthy.",
                "festivals": ["Kuvempu Janmadina (Literary celebrations)", "Bhadra Wildlife Festival"],
                "safety_info": "Forest trails should only be explored with authorized forest department guides.",
                "accessibility": "Shivamogga Town railway station (SMET) and newly inaugurated Shivamogga Airport (RQY).",
                "estimated_budget_per_day": Decimal("1600.00"),
                "is_hidden_gem": True,
                "is_trending": False,
                "rating": Decimal("4.4"),
                "review_count": 480,
                "attractions": [
                    {"name": "Sakrebailu Elephant Camp", "category": "natural", "fee": Decimal("100.00"), "hours": "8:30 AM - 11:30 AM", "duration": "2.5 hours", "lat": Decimal("13.8821"), "lng": Decimal("75.5032")},
                ]
            },
            {
                "name": "Udupi",
                "district": districts.get("Udupi"),
                "category": "temple",
                "lat": Decimal("13.3409"),
                "lng": Decimal("74.7421"),
                "description": "A sacred temple town and culinary epicentre on the Arabian coast, Udupi is celebrated for its historic 13th-century Sri Krishna Matha and pristine coastal shores like Malpe Beach.",
                "history": "Founded as a spiritual pilgrimage centre by the Dvaita philosopher saint Sri Madhvacharya in the 13th century, who installed the iconic Balakrishna idol.",
                "why_famous": "Sri Krishna Matha and Kanakana Kindi, origin of world-famous Udupi vegetarian cuisine, Malpe Beach, and St. Mary's volcanic columnar rock islands.",
                "highlights": ["Sri Krishna Matha", "Malpe Beach & Sea Walk", "St. Mary's Island", "Kapu Lighthouse Beach"],
                "best_time_to_visit": "October to March",
                "weather_info": "Tropical maritime climate; winters average 20°C - 31°C.",
                "local_food": ["Udupi Sambar & Rasam", "Goli Baje (Mangalore Bajji)", "Neer Dosa", "Patrode"],
                "culture": "Vibrant Tuluva rituals, Yakshagana folk dance-theatre, and Bhoota Kola ceremonies.",
                "festivals": ["Paryaya Festival (biennial hand-over ceremony)", "Krishna Janmashtami", "Laksha Deepotsava"],
                "safety_info": "Very clean, orderly, and hospitable city. St. Mary's ferry requires careful boarding.",
                "accessibility": "Udupi Railway Station (UD) on the scenic Konkan Railway route; Mangaluru Airport is 55 km away.",
                "estimated_budget_per_day": Decimal("1500.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.7"),
                "review_count": 860,
                "attractions": [
                    {"name": "Sri Krishna Matha", "category": "religious", "fee": Decimal("0.00"), "hours": "5:30 AM - 9:00 PM", "duration": "2 hours", "lat": Decimal("13.3409"), "lng": Decimal("74.7521")},
                    {"name": "Malpe Beach & St. Mary's Island", "category": "natural", "fee": Decimal("250.00"), "hours": "9:00 AM - 5:30 PM", "duration": "3.5 hours", "lat": Decimal("13.3512"), "lng": Decimal("74.7011")},
                ]
            },
            {
                "name": "Mangaluru",
                "district": districts.get("Dakshina Kannada"),
                "category": "city",
                "lat": Decimal("12.9141"),
                "lng": Decimal("74.8560"),
                "description": "The chief port city of Karnataka, Mangaluru is an energetic coastal metropolis renowned for picturesque beaches, historic temples, Roman Catholic churches, and world-class seafood.",
                "history": "Named after goddess Mangaladevi; an ancient port referenced in records of Pliny and Ptolemy, later ruled by Alupas, Keladi Nayakas, Hyder Ali, and the British.",
                "why_famous": "Panambur Beach, Mangaladevi Temple, Kudroli Gokarnanatheshwara Temple, and mouth-watering Mangalorean coastal culinary heritage.",
                "highlights": ["Panambur Beach & International Kite Festival", "Kudroli Gokarnanatheshwara Temple", "St. Aloysius Chapel murals", "Tannirbhavi Beach"],
                "best_time_to_visit": "October to February",
                "weather_info": "Warm and humid tropical climate, with cool sea breezes in the evenings.",
                "local_food": ["Kori Rotti with Chicken Curry", "Mangalore Fish Curry", "Ghee Roast (Paneer/Chicken/Prawn)", "Gadbad Ice Cream at Pabbas"],
                "culture": "Rich confluence of Tuluva, Konkani, Beary, and Catholic traditions celebrated through Yakshagana and Pilivesha (tiger dance).",
                "festivals": ["Mangaluru Dasara at Kudroli", "Aati Kalenja", "Kadri Kambala (buffalo race)"],
                "safety_info": "Progressive, safe coastal city with dependable auto-rickshaw metered transit and helpful local community.",
                "accessibility": "Mangaluru International Airport (IXE), Mangaluru Central (MAQ) and Mangaluru Junction (MAJN) railway stations.",
                "estimated_budget_per_day": Decimal("1800.00"),
                "is_hidden_gem": False,
                "is_trending": False,
                "rating": Decimal("4.5"),
                "review_count": 690,
                "attractions": [
                    {"name": "Panambur Beach", "category": "natural", "fee": Decimal("0.00"), "hours": "6:00 AM - 8:00 PM", "duration": "2.5 hours", "lat": Decimal("12.9463"), "lng": Decimal("74.8012")},
                    {"name": "St. Aloysius Chapel", "category": "historical", "fee": Decimal("0.00"), "hours": "9:30 AM - 1:30 PM, 3:00 PM - 5:30 PM", "duration": "1 hour", "lat": Decimal("12.8732"), "lng": Decimal("74.8436")},
                ]
            },
            {
                "name": "Jog Falls",
                "district": districts.get("Shivamogga"),
                "category": "waterfall",
                "lat": Decimal("14.2295"),
                "lng": Decimal("74.8127"),
                "description": "Dropping 253 meters in a sheer untiered plunge, Jog Falls on the Sharavathi River is the second-highest plunge waterfall in India, formed by four distinct cascades: Raja, Roarer, Rocket, and Rani.",
                "history": "Harnessed by Sir M. Visvesvaraya for the iconic Linganamakki and Mahatma Gandhi hydroelectric projects, providing power to Karnataka since the 1940s.",
                "why_famous": "Spectacular 830-foot drop of the Sharavathi river, lush rainforest scenery, and 1,400 steps leading down to the foot of the gorge.",
                "highlights": ["Raja, Roarer, Rocket, and Rani cascades", "Watkins Platform viewpoint", "Laser light show and musical fountain in the evening"],
                "best_time_to_visit": "July to December (peak volume during August-October monsoons)",
                "weather_info": "Cool and misty with heavy precipitation during monsoon season.",
                "local_food": ["Hot Mirchi Bajjis with tea at scenic viewpoints", "Malenadu thali at KSTDC Mayura Gerusoppa"],
                "culture": "Celebration of Malenadu natural grandeur and hydroelectric engineering innovation.",
                "festivals": ["Jog Utsav (annual cultural celebration)"],
                "safety_info": "Exercise extreme caution near slippery viewpoints; descend the gorge steps only with sturdy footwear and never jump safety barricades.",
                "accessibility": "Talguppa railway station is 14 km away; well connected via Sagar (30 km) and Shivamogga (100 km).",
                "estimated_budget_per_day": Decimal("1200.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.7"),
                "review_count": 820,
                "attractions": [
                    {"name": "Jog Falls Viewpoint", "category": "natural", "fee": Decimal("20.00"), "hours": "6:00 AM - 8:00 PM", "duration": "3 hours", "lat": Decimal("14.2295"), "lng": Decimal("74.8127")},
                ]
            },
            {
                "name": "Badami",
                "district": districts.get("Bagalkote"),
                "category": "heritage_site",
                "lat": Decimal("15.9150"),
                "lng": Decimal("75.6750"),
                "description": "The rugged red sandstone capital of the Early Chalukyas, Badami is renowned worldwide for its magnificent 6th-century rock-cut cave temples overlooking the sacred Agastya Lake.",
                "history": "Founded by Pulakeshin I in 540 AD as Vatapi, the Chalukyan capital pioneered Dravidian temple architectural idioms across South India.",
                "why_famous": "Four rock-cut caves carved into cliffs (Cave 1 Nataraja, Cave 2 Vishnu, Cave 3 Maha Vishnu, Cave 4 Jain Tirthankaras) and Bhutanatha Temples on the lakeshore.",
                "highlights": ["Four Cave Temples", "Agastya Lake", "Bhutanatha Temples", "Badami Sandstone Rock Climbing"],
                "best_time_to_visit": "October to March",
                "weather_info": "Dry semi-arid climate; mild pleasant winters (16°C - 30°C).",
                "local_food": ["Jolada Rotti Oota with Ennegai (stuffed brinjal)", "Shenga Chutney (peanut powder)", "Shenga Holige"],
                "culture": "Cradle of temple architecture alongside nearby Aihole and Pattadakal (UNESCO).",
                "festivals": ["Chalukya Utsav (February)", "Banashankari Temple Fair"],
                "safety_info": "Be mindful of resident temple monkeys on the rock cave steps; secure sunglasses and food items.",
                "accessibility": "Badami Railway Station (BDM) on the Hubballi-Solapur route; Hubballi Airport (105 km).",
                "estimated_budget_per_day": Decimal("1300.00"),
                "is_hidden_gem": True,
                "is_trending": False,
                "rating": Decimal("4.8"),
                "review_count": 640,
                "attractions": [
                    {"name": "Badami Cave Temples", "category": "historical", "fee": Decimal("25.00"), "hours": "9:00 AM - 5:30 PM", "duration": "2.5 hours", "lat": Decimal("15.9189"), "lng": Decimal("75.6791")},
                    {"name": "Bhutanatha Temple Complex", "category": "historical", "fee": Decimal("0.00"), "hours": "6:00 AM - 6:00 PM", "duration": "1.5 hours", "lat": Decimal("15.9202"), "lng": Decimal("75.6881")},
                ]
            },
            {
                "name": "Belur",
                "district": districts.get("Hassan"),
                "category": "heritage_site",
                "lat": Decimal("13.1631"),
                "lng": Decimal("75.8655"),
                "description": "A jewel of Hoysala artistic genius (UNESCO World Heritage Site inscribed in 2023), Belur is acclaimed for the breathtaking Chennakeshava Temple, carved with microscopic soapstone precision.",
                "history": "Capital of the Hoysala Empire under King Vishnuvardhana, who commissioned the Chennakeshava temple in 1117 AD to celebrate his military victory over the Cholas.",
                "why_famous": "UNESCO World Heritage Sacred Ensembles of the Hoysalas, famous for the 42 intricate bracket figures (Madanikas / Salabhanjikas) and star-shaped platform.",
                "highlights": ["Chennakeshava Temple", "Gravity Pillar (Dhvaja Sthambha)", "Darpana Sundari (Lady with mirror) carving", "Stepped water tank (Kalyani)"],
                "best_time_to_visit": "October to March",
                "weather_info": "Mild, pleasant plateau weather; comfortable winter daytime temperatures around 25°C.",
                "local_food": ["Traditional Hassan South Indian meals", "Akki Rotti", "Butter Masala Dosa"],
                "culture": "Unrivalled sculptural craftsmanship capturing classical dancers, epics, and celestial musicians in chloritic schist (soapstone).",
                "festivals": ["Belur Chennakeshava Car Festival (March-April)", "Hoysala Mahotsava"],
                "safety_info": "Quiet temple town; engage certified ASI guides at the temple gate for in-depth iconography explanation.",
                "accessibility": "Hassan Junction (38 km away) has direct trains from Bengaluru and Mysuru; well-connected via NH 75.",
                "estimated_budget_per_day": Decimal("1300.00"),
                "is_hidden_gem": False,
                "is_trending": True,
                "rating": Decimal("4.8"),
                "review_count": 710,
                "attractions": [
                    {"name": "Chennakeshava Temple", "category": "historical", "fee": Decimal("0.00"), "hours": "7:30 AM - 7:30 PM", "duration": "2.5 hours", "lat": Decimal("13.1631"), "lng": Decimal("75.8655")},
                ]
            },
            {
                "name": "Halebidu",
                "district": districts.get("Hassan"),
                "category": "heritage_site",
                "lat": Decimal("13.2089"),
                "lng": Decimal("75.9916"),
                "description": "Former regal capital of the Hoysalas (Dorasamudra), Halebidu houses the majestic Hoysaleswara and Kedareshwara temples, exhibiting some of the most intricate friezes in Indian temple art.",
                "history": "Prospered as Dorasamudra for 200 years until sacked by the Delhi Sultanate forces of Malik Kafur in the 14th century, earning the name 'Hale-bidu' (the old ruined city).",
                "why_famous": "UNESCO World Heritage Hoysaleswara Temple, featuring unbroken stone friezes of thousands of elephants, lions, horses, makaras, and swans with no two identical.",
                "highlights": ["Hoysaleswara twin temples", "Monolithic Nandi sculptures", "Basadi Halli Jain Temples", "Archaeological Museum"],
                "best_time_to_visit": "October to March",
                "weather_info": "Temperate weather, pleasant breeze from the adjoining Dorasamudra Lake.",
                "local_food": ["Hassan village thali", "Obbattu / Holige", "Filter coffee"],
                "culture": "Celebration of high medieval Hoysala architecture; part of the sacred Hoysala circuit alongside Belur and Somnathpura.",
                "festivals": ["Hoysala Festival (March)", "Maha Shivaratri at Hoysaleswara"],
                "safety_info": "Easy walking terrain; keep hydration handy when touring open outdoor stone courtyards in afternoon sun.",
                "accessibility": "Just 16 km from Belur and 31 km from Hassan; easily visited in a single day circuit from Hassan or Bengaluru.",
                "estimated_budget_per_day": Decimal("1200.00"),
                "is_hidden_gem": False,
                "is_trending": False,
                "rating": Decimal("4.8"),
                "review_count": 680,
                "attractions": [
                    {"name": "Hoysaleswara Temple", "category": "historical", "fee": Decimal("0.00"), "hours": "6:30 AM - 6:30 PM", "duration": "2.5 hours", "lat": Decimal("13.2132"), "lng": Decimal("75.9942")},
                ]
            },
            {
                "name": "Kabini",
                "district": districts.get("Mysuru"),
                "category": "national_park",
                "lat": Decimal("11.9479"),
                "lng": Decimal("76.3365"),
                "description": "One of India's premier wildlife and tiger reserves on the periphery of Nagarhole National Park, Kabini is celebrated for massive herds of Asiatic elephants and the elusive Black Panther.",
                "history": "Formerly the exclusive private hunting grounds of the Maharajas of Mysore and British Viceroys, transformed into a protected sanctuary under Project Tiger.",
                "why_famous": "Boat and jeep safaris along the Kabini backwaters, prime tiger and leopard habitat, and world-famous sightings of the melanistic leopard (Black Panther - 'Saya').",
                "highlights": ["Kabini River Safari", "Nagarhole Tiger Tracking Jeep Safari", "Kabini Dam", "Balle Elephant Camp"],
                "best_time_to_visit": "October to May (summer months March-May are best for wildlife sightings around receding waterholes)",
                "weather_info": "Subtropical forest climate; cool morning mists and warm afternoons (18°C - 34°C).",
                "local_food": ["Wild forest honey", "Hearty South Indian buffet spreads at eco-lodges", "Bamboo shoot curry"],
                "culture": "Indigenous Jenu Kuruba and Kadu Kuruba tribal wisdom and wildlife conservation practices.",
                "festivals": ["World Wildlife Day celebrations", "Mysore forest conservation summits"],
                "safety_info": "Strict forest department rules: stay inside safari vehicles at all times, avoid bright clothes and loud noises.",
                "accessibility": "Mysuru is 80 km away (2 hours drive); Kempegowda International Airport Bengaluru is 230 km away.",
                "estimated_budget_per_day": Decimal("4500.00"),
                "is_hidden_gem": True,
                "is_trending": True,
                "rating": Decimal("4.9"),
                "review_count": 520,
                "attractions": [
                    {"name": "Kabini Wildlife Safari", "category": "adventure", "fee": Decimal("1800.00"), "hours": "6:00 AM - 9:00 AM, 3:30 PM - 6:30 PM", "duration": "3 hours", "lat": Decimal("11.9479"), "lng": Decimal("76.3365")},
                ]
            },
            {
                "name": "Sakleshpur",
                "district": districts.get("Hassan"),
                "category": "hill_station",
                "lat": Decimal("12.9411"),
                "lng": Decimal("75.7854"),
                "description": "A tranquil hill station nestled in the biodiversity-rich Western Ghats, famed for lush coffee and cardamom slopes, the star-shaped Manjarabad Fort, and the famous Green Route railway trek.",
                "history": "Home to the 1792 star-shaped fort built by Tipu Sultan to defend against the Marathas and the British, designed by French military engineers.",
                "why_famous": "Manjarabad Fort, picturesque railway track trek through tunnels and viaducts (Green Route), Bisle Ghat viewpoint, and cozy coffee estate stays.",
                "highlights": ["Manjarabad Star Fort", "Bisle Ghat Reserve Viewpoint", "Jenukallu Gudda trek", "Magajahalli Waterfalls"],
                "best_time_to_visit": "September to March",
                "weather_info": "Cool mountain climate with mist-laden mornings and invigorating monsoons.",
                "local_food": ["Cardamom-infused coffee", "Akki Rotti with Kesuvina Soppu curry", "Jackfruit fritters"],
                "culture": "Relaxed plantation ethos with warm Malenadu hospitality.",
                "festivals": ["Sakleshpur Coffee & Spice Fest", "Hassan Dasara"],
                "safety_info": "Trekking during heavy monsoons requires salt or leech repellents; wear sturdy non-slip boots.",
                "accessibility": "Sakleshpur Railway Station (SKLR) has scenic trains to Subrahmanya and Mangaluru; 220 km from Bengaluru via NH 75.",
                "estimated_budget_per_day": Decimal("1700.00"),
                "is_hidden_gem": True,
                "is_trending": False,
                "rating": Decimal("4.6"),
                "review_count": 430,
                "attractions": [
                    {"name": "Manjarabad Fort", "category": "historical", "fee": Decimal("0.00"), "hours": "8:00 AM - 5:30 PM", "duration": "2 hours", "lat": Decimal("12.9167"), "lng": Decimal("75.7533")},
                    {"name": "Bisle Ghat Viewpoint", "category": "natural", "fee": Decimal("0.00"), "hours": "6:00 AM - 6:00 PM", "duration": "2 hours", "lat": Decimal("12.7167"), "lng": Decimal("75.7167")},
                ]
            },
        ]

        for d_info in destinations_info:
            slug = slugify(f"{d_info['name']}-karnataka")
            dest, created = Destination.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": d_info["name"],
                    "state": karnataka,
                    "district": d_info["district"],
                    "category": d_info["category"],
                    "latitude": d_info["lat"],
                    "longitude": d_info["lng"],
                    "description": d_info["description"],
                    "history": d_info["history"],
                    "why_famous": d_info["why_famous"],
                    "highlights": d_info["highlights"],
                    "best_time_to_visit": d_info["best_time_to_visit"],
                    "weather_info": d_info["weather_info"],
                    "local_food": d_info["local_food"],
                    "culture": d_info["culture"],
                    "festivals": d_info["festivals"],
                    "safety_info": d_info["safety_info"],
                    "accessibility": d_info["accessibility"],
                    "estimated_budget_per_day": d_info["estimated_budget_per_day"],
                    "is_hidden_gem": d_info["is_hidden_gem"],
                    "is_trending": d_info["is_trending"],
                    "rating": d_info["rating"],
                    "review_count": d_info["review_count"],
                }
            )

            # Seed attractions for destination
            for att in d_info.get("attractions", []):
                Attraction.objects.update_or_create(
                    destination=dest,
                    name=att["name"],
                    defaults={
                        "category": att["category"],
                        "entry_fee": att["fee"],
                        "opening_hours": att["hours"],
                        "visit_duration": att["duration"],
                        "latitude": att["lat"],
                        "longitude": att["lng"],
                    }
                )

            # Seed primary media entry
            DestinationMedia.objects.update_or_create(
                destination=dest,
                title=f"{dest.name} Overview",
                defaults={
                    "media_type": "image",
                    "url": f"https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200",
                    "source": "Unsplash Travel",
                    "is_primary": True,
                }
            )

        self.stdout.write(f'Seeded {len(destinations_info)} pilot destinations with attractions and media.')
