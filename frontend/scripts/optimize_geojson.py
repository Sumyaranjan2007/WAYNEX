import json

# Douglas-Peucker simplification algorithm for authentic high-fidelity contours at fast WebGL speeds
def point_line_distance(point, start, end):
    if start == end:
        return ((point[0] - start[0])**2 + (point[1] - start[1])**2) ** 0.5
    n = abs((end[1] - start[1]) * point[0] - (end[0] - start[0]) * point[1] + end[0] * start[1] - end[1] * start[0])
    d = ((end[1] - start[1])**2 + (end[0] - start[0])**2) ** 0.5
    return n / d

def douglas_peucker(points, tolerance):
    if len(points) <= 2:
        return points
    dmax = 0
    index = 0
    for i in range(1, len(points) - 1):
        d = point_line_distance(points[i], points[0], points[-1])
        if d > dmax:
            index = i
            dmax = d
    if dmax > tolerance:
        rec_results1 = douglas_peucker(points[:index+1], tolerance)
        rec_results2 = douglas_peucker(points[index:], tolerance)
        return rec_results1[:-1] + rec_results2
    else:
        return [points[0], points[-1]]

in_path = r'c:\Users\suren\OneDrive\Desktop\WAYNEX\frontend\public\geojson\india-states.json'
with open(in_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# ~0.04 degrees tolerance (~4km resolution, preserving high geographical accuracy while reducing file from 10MB to ~700KB)
TOLERANCE = 0.035

for feat in data['features']:
    geom = feat['geometry']
    new_coords = []
    for poly in geom['coordinates']:
        new_poly = []
        for ring in poly:
            # Ensure closed ring
            is_closed = (ring[0] == ring[-1])
            simplified = douglas_peucker(ring, TOLERANCE)
            if len(simplified) < 4:
                simplified = ring[::max(1, len(ring)//6)]
                if simplified[-1] != ring[-1]:
                    simplified.append(ring[-1])
            if is_closed and simplified[0] != simplified[-1]:
                simplified.append(simplified[0])
            # round to 4 decimals (10m accuracy)
            simplified = [[round(p[0], 4), round(p[1], 4)] for p in simplified]
            new_poly.append(simplified)
        new_coords.append(new_poly)
    geom['coordinates'] = new_coords

with open(in_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, separators=(',', ':'))

print("Optimized GeoJSON successfully saved!")
