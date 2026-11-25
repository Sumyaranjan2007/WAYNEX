import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'waynex.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.social.models import TravelRoom, RoomMember, RoomMessage, RoomItineraryItem, RoomExpense, RoomPoll

User = get_user_model()

# Ensure demo users exist
u1, _ = User.objects.get_or_create(username='aarav_m', defaults={'email': 'aarav@example.com', 'first_name': 'Aarav', 'last_name': 'Mehta'})
u2, _ = User.objects.get_or_create(username='sneha_p', defaults={'email': 'sneha@example.com', 'first_name': 'Sneha', 'last_name': 'Patel'})
u3, _ = User.objects.get_or_create(username='kabir_d', defaults={'email': 'kabir@example.com', 'first_name': 'Kabir', 'last_name': 'Das'})
u4, _ = User.objects.get_or_create(username='ananya_s', defaults={'email': 'ananya@example.com', 'first_name': 'Ananya', 'last_name': 'Sharma'})
u5, _ = User.objects.get_or_create(username='rohan_v', defaults={'email': 'rohan@example.com', 'first_name': 'Rohan', 'last_name': 'Varma'})

rooms_data = [
    {
        'name': 'Coorg Coffee Plantation & River Rafting Trek',
        'destination_city': 'Coorg (Madikeri)',
        'state_name': 'Karnataka',
        'starting_location': 'Bengaluru (Majestic)',
        'travel_dates_start': '2026-12-15',
        'travel_dates_end': '2026-12-18',
        'duration_days': 3,
        'budget_per_person': 4500,
        'min_budget': 3500,
        'max_budget': 5500,
        'max_members': 6,
        'travel_style': 'nature',
        'transport_preference': 'bus',
        'women_only': False,
        'visibility': 'public',
        'cover_image': 'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&auto=format&fit=crop&q=80',
        'description': 'Sharing an estate homestay in Madikeri, morning Arabica coffee walks, hiking Abbey Falls, and river rafting at Dubare Elephant Camp.',
        'room_rules': 'No smoking inside homestay dorms. Early morning starts at 7:00 AM.',
        'creator': u2,
        'members': [u2, u1, u4],
        'messages': [
            (u2, 'Hey everyone! Welcome to the Coorg expedition room! ☕'),
            (u1, 'Excited for the river rafting! Have booked our KSRTC Volvo tickets from Majestic.'),
            (u4, 'Homestay owner confirmed local Kodava dinner for Friday night!')
        ],
        'itinerary': [
            (1, '10:00 AM', 'Madikeri Estate Arrival & Check-In', 'Settle into plantation homestay and enjoy fresh filter coffee.', 'stay', 0),
            (1, '02:30 PM', 'Abbey Falls Hike & Hanging Bridge', 'Scenic cascading falls surrounded by spice plantations.', 'nature', 50),
            (2, '09:00 AM', 'Dubare Elephant Camp & River Rafting', 'Interact with gentle giants and gentle rapid rafting on Cauvery.', 'adventure', 400),
            (2, '04:30 PM', 'Raja’s Seat Panoramic Sunset', 'Historical garden viewpoint favored by Coorg kings.', 'sightseeing', 30),
        ],
        'expenses': [
            ('Shared Plantation Homestay (2 Nights)', 6000, 'accommodation', u2, ['sneha_p', 'aarav_m', 'ananya_s']),
            ('Dubare Rafting Group Package', 1200, 'activities', u1, ['sneha_p', 'aarav_m', 'ananya_s']),
        ]
    },
    {
        'name': 'Women-Only Himachal Parvati Valley & Kasol Retreat',
        'destination_city': 'Kasol & Tosh',
        'state_name': 'Himachal Pradesh',
        'starting_location': 'New Delhi (Kashmere Gate)',
        'travel_dates_start': '2026-12-22',
        'travel_dates_end': '2026-12-27',
        'duration_days': 5,
        'budget_per_person': 7500,
        'min_budget': 6000,
        'max_budget': 9000,
        'max_members': 5,
        'travel_style': 'backpacking',
        'transport_preference': 'bus',
        'women_only': True,
        'visibility': 'public',
        'cover_image': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        'description': 'Safe, verified all-women travel group exploring pine forests of Parvati Valley, Manikaran hot springs, and cozy cafe culture in Kasol.',
        'room_rules': 'Women-only verified members. Respectful community culture.',
        'creator': u4,
        'members': [u4, u2],
        'messages': [
            (u4, 'Welcome ladies! Our Volvo bus departs Kashmere Gate at 8:30 PM on Dec 21st.'),
            (u2, 'Looking forward to the Kheerganga hot water spring trek!')
        ],
        'itinerary': [
            (1, '11:00 AM', 'Arrival in Kasol & Riverside Cafe Brunch', 'Check in at riverside hostel and enjoy hot shakshuka.', 'food', 250),
            (2, '08:30 AM', 'Manikaran Sahib Gurudwara & Natural Hot Springs', 'Spiritual experience and holy hot water dips.', 'temple', 0),
        ],
        'expenses': [
            ('Volvo Bus Group Booking (Delhi-Bhuntar)', 4400, 'transport', u4, ['ananya_s', 'sneha_p']),
        ]
    },
    {
        'name': 'Hampi Bouldering, Ruins & Sunset Cycling',
        'destination_city': 'Hampi',
        'state_name': 'Karnataka',
        'starting_location': 'Bengaluru (KSR / Yesvantpur)',
        'travel_dates_start': '2026-12-08',
        'travel_dates_end': '2026-12-11',
        'duration_days': 3,
        'budget_per_person': 3800,
        'min_budget': 3000,
        'max_budget': 4500,
        'max_members': 8,
        'travel_style': 'heritage',
        'transport_preference': 'train',
        'women_only': False,
        'visibility': 'public',
        'cover_image': 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=800&auto=format&fit=crop&q=80',
        'description': 'Exploring the 14th-century Vijayanagara empire ruins, cycling through banana groves, and cliff sunset from Sanapur Lake.',
        'room_rules': 'Bring walking shoes and headlamps for sunset descents.',
        'creator': u1,
        'members': [u1, u3, u5],
        'messages': [
            (u1, 'Train tickets confirmed on Hampi Express!'),
            (u3, 'Bicycle rental shop in Hampi Bazaar arranged for ₹150/day.')
        ],
        'itinerary': [
            (1, '09:00 AM', 'Virupaksha Temple & Hampi Bazaar Walk', 'Ancient 7th-century functioning temple and stone colonnade.', 'heritage', 50),
            (1, '04:30 PM', 'Matanga Hill Sunset Hike', 'Highest panoramic point in Hampi overlooking Tungabhadra River.', 'nature', 0),
        ],
        'expenses': [
            ('Hampi Express Train Tickets (3 pax)', 1290, 'transport', u1, ['aarav_m', 'kabir_d', 'rohan_v']),
        ]
    },
    {
        'name': 'Gokarna Cliff Trek & Beach Bonfire Backpackers',
        'destination_city': 'Gokarna',
        'state_name': 'Karnataka',
        'starting_location': 'Goa / Hubballi',
        'travel_dates_start': '2026-12-18',
        'travel_dates_end': '2026-12-21',
        'duration_days': 3,
        'budget_per_person': 3200,
        'min_budget': 2500,
        'max_budget': 4000,
        'max_members': 6,
        'travel_style': 'adventure',
        'transport_preference': 'train',
        'women_only': False,
        'visibility': 'public',
        'cover_image': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        'description': 'Hiking the coastal trail connecting Belekan, Paradise, Half Moon, and Om Beach. Camping under coastal stars.',
        'room_rules': 'Leave No Trace eco principles strictly followed.',
        'creator': u3,
        'members': [u3, u5],
        'messages': [
            (u3, 'Tent rentals sorted at Paradise Beach!'),
        ],
        'itinerary': [
            (1, '07:30 AM', '5-Beach Cliff Trek Trail', 'Breathtaking coastal ridge hiking connecting secluded coves.', 'adventure', 0),
        ],
        'expenses': [
            ('Om Beach Shacks Lunch & Fresh Juices', 980, 'food', u3, ['kabir_d', 'rohan_v']),
        ]
    }
]

print("=== SEEDING WAYNEX CONNECT ROOMS ===")
for r_data in rooms_data:
    room, created = TravelRoom.objects.get_or_create(
        name=r_data['name'],
        defaults={
            'destination_city': r_data['destination_city'],
            'state_name': r_data['state_name'],
            'starting_location': r_data['starting_location'],
            'travel_dates_start': r_data['travel_dates_start'],
            'travel_dates_end': r_data['travel_dates_end'],
            'duration_days': r_data['duration_days'],
            'budget_per_person': r_data['budget_per_person'],
            'min_budget': r_data['min_budget'],
            'max_budget': r_data['max_budget'],
            'max_members': r_data['max_members'],
            'travel_style': r_data['travel_style'],
            'transport_preference': r_data['transport_preference'],
            'women_only': r_data['women_only'],
            'visibility': r_data['visibility'],
            'cover_image': r_data['cover_image'],
            'description': r_data['description'],
            'room_rules': r_data['room_rules'],
            'creator': r_data['creator'],
        }
    )
    if created:
        print(f"Created Room: {room.name}")
        # Add members
        for m_user in r_data['members']:
            RoomMember.objects.get_or_create(
                room=room, user=m_user,
                defaults={'role': 'admin' if m_user == room.creator else 'member', 'status': 'approved'}
            )
        # Add messages
        for sender, text in r_data['messages']:
            RoomMessage.objects.create(room=room, sender=sender, content=text)
        # Add itinerary items
        for day, time, title, desc, cat, fee in r_data['itinerary']:
            RoomItineraryItem.objects.create(
                room=room, day_number=day, time_slot=time, title=title,
                description=desc, category=cat, entry_fee=fee, suggested_by=room.creator, votes_count=len(r_data['members'])
            )
        # Add expenses
        for exp_title, amt, cat, payer, split in r_data['expenses']:
            RoomExpense.objects.create(
                room=room, title=exp_title, amount=amt, category=cat, paid_by=payer, split_among=split
            )
    else:
        print(f"Room exists: {room.name}")

print("=== SEEDING COMPLETED ===")
