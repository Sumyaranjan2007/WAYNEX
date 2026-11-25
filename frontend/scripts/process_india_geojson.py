import json
import urllib.request
import re

STATE_METADATA = {
    'andaman and nicobar': {'name': 'Andaman and Nicobar Islands', 'slug': 'andaman-and-nicobar-islands', 'code': 'AN', 'capital': 'Port Blair', 'type': 'ut'},
    'andhra pradesh': {'name': 'Andhra Pradesh', 'slug': 'andhra-pradesh', 'code': 'AP', 'capital': 'Amaravati', 'type': 'state'},
    'arunachal pradesh': {'name': 'Arunachal Pradesh', 'slug': 'arunachal-pradesh', 'code': 'AR', 'capital': 'Itanagar', 'type': 'state'},
    'assam': {'name': 'Assam', 'slug': 'assam', 'code': 'AS', 'capital': 'Dispur', 'type': 'state'},
    'bihar': {'name': 'Bihar', 'slug': 'bihar', 'code': 'BR', 'capital': 'Patna', 'type': 'state'},
    'chandigarh': {'name': 'Chandigarh', 'slug': 'chandigarh', 'code': 'CH', 'capital': 'Chandigarh', 'type': 'ut'},
    'chhattisgarh': {'name': 'Chhattisgarh', 'slug': 'chhattisgarh', 'code': 'CG', 'capital': 'Raipur', 'type': 'state'},
    'dadra and nagar haveli': {'name': 'Dadra and Nagar Haveli and Daman and Diu', 'slug': 'dadra-and-nagar-haveli-and-daman-and-diu', 'code': 'DD', 'capital': 'Daman', 'type': 'ut'},
    'daman and diu': {'name': 'Dadra and Nagar Haveli and Daman and Diu', 'slug': 'dadra-and-nagar-haveli-and-daman-and-diu', 'code': 'DD', 'capital': 'Daman', 'type': 'ut'},
    'delhi': {'name': 'Delhi', 'slug': 'delhi', 'code': 'DL', 'capital': 'New Delhi', 'type': 'ut'},
    'goa': {'name': 'Goa', 'slug': 'goa', 'code': 'GA', 'capital': 'Panaji', 'type': 'state'},
    'gujarat': {'name': 'Gujarat', 'slug': 'gujarat', 'code': 'GJ', 'capital': 'Gandhinagar', 'type': 'state'},
    'haryana': {'name': 'Haryana', 'slug': 'haryana', 'code': 'HR', 'capital': 'Chandigarh', 'type': 'state'},
    'himachal pradesh': {'name': 'Himachal Pradesh', 'slug': 'himachal-pradesh', 'code': 'HP', 'capital': 'Shimla', 'type': 'state'},
    'jammu and kashmir': {'name': 'Jammu and Kashmir', 'slug': 'jammu-and-kashmir', 'code': 'JK', 'capital': 'Srinagar', 'type': 'ut'},
    'ladakh': {'name': 'Ladakh', 'slug': 'ladakh', 'code': 'LA', 'capital': 'Leh', 'type': 'ut'},
    'jharkhand': {'name': 'Jharkhand', 'slug': 'jharkhand', 'code': 'JH', 'capital': 'Ranchi', 'type': 'state'},
    'karnataka': {'name': 'Karnataka', 'slug': 'karnataka', 'code': 'KA', 'capital': 'Bengaluru', 'type': 'state'},
    'kerala': {'name': 'Kerala', 'slug': 'kerala', 'code': 'KL', 'capital': 'Thiruvananthapuram', 'type': 'state'},
    'lakshadweep': {'name': 'Lakshadweep', 'slug': 'lakshadweep', 'code': 'LD', 'capital': 'Kavaratti', 'type': 'ut'},
    'madhya pradesh': {'name': 'Madhya Pradesh', 'slug': 'madhya-pradesh', 'code': 'MP', 'capital': 'Bhopal', 'type': 'state'},
    'maharashtra': {'name': 'Maharashtra', 'slug': 'maharashtra', 'code': 'MH', 'capital': 'Mumbai', 'type': 'state'},
    'manipur': {'name': 'Manipur', 'slug': 'manipur', 'code': 'MN', 'capital': 'Imphal', 'type': 'state'},
    'meghalaya': {'name': 'Meghalaya', 'slug': 'meghalaya', 'code': 'ML', 'capital': 'Shillong', 'type': 'state'},
    'mizoram': {'name': 'Mizoram', 'slug': 'mizoram', 'code': 'MZ', 'capital': 'Aizawl', 'type': 'state'},
    'nagaland': {'name': 'Nagaland', 'slug': 'nagaland', 'code': 'NL', 'capital': 'Kohima', 'type': 'state'},
    'orissa': {'name': 'Odisha', 'slug': 'odisha', 'code': 'OD', 'capital': 'Bhubaneswar', 'type': 'state'},
    'odisha': {'name': 'Odisha', 'slug': 'odisha', 'code': 'OD', 'capital': 'Bhubaneswar', 'type': 'state'},
    'puducherry': {'name': 'Puducherry', 'slug': 'puducherry', 'code': 'PY', 'capital': 'Puducherry', 'type': 'ut'},
    'punjab': {'name': 'Punjab', 'slug': 'punjab', 'code': 'PB', 'capital': 'Chandigarh', 'type': 'state'},
    'rajasthan': {'name': 'Rajasthan', 'slug': 'rajasthan', 'code': 'RJ', 'capital': 'Jaipur', 'type': 'state'},
    'sikkim': {'name': 'Sikkim', 'slug': 'sikkim', 'code': 'SK', 'capital': 'Gangtok', 'type': 'state'},
    'tamil nadu': {'name': 'Tamil Nadu', 'slug': 'tamil-nadu', 'code': 'TN', 'capital': 'Chennai', 'type': 'state'},
    'telangana': {'name': 'Telangana', 'slug': 'telangana', 'code': 'TG', 'capital': 'Hyderabad', 'type': 'state'},
    'tripura': {'name': 'Tripura', 'slug': 'tripura', 'code': 'TR', 'capital': 'Agartala', 'type': 'state'},
    'uttar pradesh': {'name': 'Uttar Pradesh', 'slug': 'uttar-pradesh', 'code': 'UP', 'capital': 'Lucknow', 'type': 'state'},
    'uttaranchal': {'name': 'Uttarakhand', 'slug': 'uttarakhand', 'code': 'UK', 'capital': 'Dehradun', 'type': 'state'},
    'uttarakhand': {'name': 'Uttarakhand', 'slug': 'uttarakhand', 'code': 'UK', 'capital': 'Dehradun', 'type': 'state'},
    'west bengal': {'name': 'West Bengal', 'slug': 'west-bengal', 'code': 'WB', 'capital': 'Kolkata', 'type': 'state'}
}

def simplify_ring(ring, step=2):
    if len(ring) <= 12:
        return ring
    simplified = ring[::step]
    if simplified[-1] != ring[-1]:
        simplified.append(ring[-1])
    return simplified

def simplify_geom(geom):
    gtype = geom['type']
    coords = geom['coordinates']
    if gtype == 'Polygon':
        return {'type': 'MultiPolygon', 'coordinates': [[simplify_ring(r) for r in coords]]}
    elif gtype == 'MultiPolygon':
        return {'type': 'MultiPolygon', 'coordinates': [[simplify_ring(r) for r in poly] for poly in coords]}
    return geom

url = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
raw_data = json.loads(urllib.request.urlopen(req, timeout=15).read().decode('utf-8'))

output_features = []
seen_slugs = set()

for feat in raw_data['features']:
    name_1 = feat['properties'].get('NAME_1', '').strip()
    clean_name = name_1.lower()
    meta = STATE_METADATA.get(clean_name)

    if not meta:
        print(f"Skipping unknown: {name_1}")
        continue

    slug = meta['slug']
    geom = simplify_geom(feat['geometry'])

    # Separate Ladakh from Jammu and Kashmir
    if slug == 'jammu-and-kashmir':
        jk_polys = []
        ladakh_polys = []
        for poly in geom['coordinates']:
            outer = poly[0]
            avg_lon = sum(p[0] for p in outer) / len(outer)
            if avg_lon >= 76.5:
                ladakh_polys.append(poly)
            else:
                jk_polys.append(poly)

        if not ladakh_polys:
            ladakh_boundary = [
                [76.3, 33.2], [75.9, 34.5], [76.5, 35.4], [77.2, 35.8], [77.8, 35.5],
                [78.5, 35.3], [79.2, 34.8], [79.9, 34.2], [79.6, 33.5], [78.9, 32.8],
                [78.2, 32.5], [77.5, 32.7], [76.8, 33.0], [76.3, 33.2]
            ]
            ladakh_polys.append([ladakh_boundary])

        seen_slugs.add('jammu-and-kashmir')
        seen_slugs.add('ladakh')

        output_features.append({
            'type': 'Feature',
            'properties': STATE_METADATA['jammu and kashmir'],
            'geometry': {'type': 'MultiPolygon', 'coordinates': jk_polys if jk_polys else geom['coordinates']}
        })
        output_features.append({
            'type': 'Feature',
            'properties': STATE_METADATA['ladakh'],
            'geometry': {'type': 'MultiPolygon', 'coordinates': ladakh_polys}
        })
        continue

    # Merge Dadra & Nagar Haveli and Daman & Diu
    if slug in seen_slugs:
        for existing in output_features:
            if existing['properties']['slug'] == slug:
                existing['geometry']['coordinates'].extend(geom['coordinates'])
                break
        continue

    seen_slugs.add(slug)
    output_features.append({
        'type': 'Feature',
        'properties': meta,
        'geometry': geom
    })

print(f"Total features created: {len(output_features)}")
print(f"Total unique slugs: {len(seen_slugs)}")

geojson_data = {
    'type': 'FeatureCollection',
    'features': output_features
}

out_path = r'c:\Users\suren\OneDrive\Desktop\WAYNEX\frontend\public\geojson\india-states.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(geojson_data, f, separators=(',', ':'))

print("GeoJSON generated successfully!")
