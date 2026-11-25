import urllib.request
import urllib.error
import json
import time

urls = [
    ("Homepage", "http://localhost:3000/"),
    ("Explore Atlas (36 States & UTs)", "http://localhost:3000/explore"),
    ("Destinations Catalog (547 records)", "http://localhost:3000/destinations"),
    ("Destination Detail - Puri (Odisha)", "http://localhost:3000/destinations/puri-odisha"),
    ("Destination Detail - Munnar (Kerala)", "http://localhost:3000/destinations/munnar-kerala"),
    ("Destination Detail - Varanasi Ghats (UP)", "http://localhost:3000/destinations/varanasi-ghats-uttar-pradesh"),
    ("State Explore - Odisha", "http://localhost:3000/explore/odisha"),
    ("State Explore - Rajasthan", "http://localhost:3000/explore/rajasthan"),
    ("State Explore - Ladakh", "http://localhost:3000/explore/ladakh"),
    ("Budget Planner", "http://localhost:3000/budget-planner"),
    ("Transport Explorer", "http://localhost:3000/transport"),
    ("WAYNEX Safe", "http://localhost:3000/safe"),
    ("Backend API - States (v1)", "http://127.0.0.1:8000/api/v1/states/"),
    ("Backend API - Destinations (v1)", "http://127.0.0.1:8000/api/v1/destinations/"),
]

print("=== WAYNEX FULL-STACK VERIFICATION SUITE ===")
all_passed = True
results = []

for name, url in urls:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "WAYNEX-TestRunner/1.0"}
    )
    start_t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            elapsed = (time.time() - start_t) * 1000
            content = response.read()
            size_kb = len(content) / 1024
            print(f"[{status}] OK: {name} ({elapsed:.1f}ms, {size_kb:.1f} KB)")
            results.append({"name": name, "url": url, "status": status, "size_kb": size_kb, "elapsed_ms": elapsed})
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] FAIL: {name} -> {e.reason}")
        all_passed = False
        results.append({"name": name, "url": url, "status": e.code, "error": str(e)})
    except Exception as e:
        print(f"[ERR] FAIL: {name} -> {e}")
        all_passed = False
        results.append({"name": name, "url": url, "status": "ERROR", "error": str(e)})

print("\nSUMMARY:")
print(f"Total endpoints tested: {len(urls)}")
print(f"All passed: {all_passed}")
