const fs = require('fs');
const path = require('path');

const states = [
  // --- NORTH & HIMALAYAS ---
  {
    name: "Ladakh",
    slug: "ladakh",
    code: "LA",
    capital: "Leh",
    type: "ut",
    coords: [
      [75.5, 36.0], [77.5, 36.8], [80.0, 35.5], [79.2, 33.2], [77.8, 32.5], [76.5, 33.4], [75.5, 36.0]
    ]
  },
  {
    name: "Jammu and Kashmir",
    slug: "jammu-and-kashmir",
    code: "JK",
    capital: "Srinagar",
    type: "ut",
    coords: [
      [73.8, 34.5], [75.5, 36.0], [76.5, 33.4], [75.8, 32.5], [74.4, 32.8], [73.8, 34.5]
    ]
  },
  {
    name: "Himachal Pradesh",
    slug: "himachal-pradesh",
    code: "HP",
    capital: "Shimla",
    type: "state",
    coords: [
      [75.8, 32.5], [77.8, 32.5], [78.9, 31.5], [77.6, 30.8], [76.2, 31.3], [75.8, 32.5]
    ]
  },
  {
    name: "Punjab",
    slug: "punjab",
    code: "PB",
    capital: "Chandigarh",
    type: "state",
    coords: [
      [74.2, 31.8], [75.8, 32.5], [76.5, 31.0], [76.8, 30.5], [75.2, 29.8], [74.2, 30.5], [74.2, 31.8]
    ]
  },
  {
    name: "Chandigarh",
    slug: "chandigarh",
    code: "CH",
    capital: "Chandigarh",
    type: "ut",
    coords: [
      [76.75, 30.76], [76.82, 30.76], [76.82, 30.70], [76.75, 30.70], [76.75, 30.76]
    ]
  },
  {
    name: "Uttarakhand",
    slug: "uttarakhand",
    code: "UK",
    capital: "Dehradun",
    type: "state",
    coords: [
      [77.6, 30.8], [78.9, 31.5], [80.8, 30.8], [80.2, 28.8], [79.2, 29.2], [77.8, 30.0], [77.6, 30.8]
    ]
  },
  {
    name: "Haryana",
    slug: "haryana",
    code: "HR",
    capital: "Chandigarh",
    type: "state",
    coords: [
      [75.2, 29.8], [76.8, 30.5], [77.3, 29.5], [77.4, 28.2], [76.0, 28.0], [75.0, 28.8], [75.2, 29.8]
    ]
  },
  {
    name: "Delhi",
    slug: "delhi",
    code: "DL",
    capital: "New Delhi",
    type: "ut",
    coords: [
      [76.9, 28.8], [77.3, 28.8], [77.3, 28.4], [76.9, 28.4], [76.9, 28.8]
    ]
  },

  // --- WEST & CENTRAL ---
  {
    name: "Rajasthan",
    slug: "rajasthan",
    code: "RJ",
    capital: "Jaipur",
    type: "state",
    coords: [
      [70.0, 27.5], [72.5, 29.8], [75.0, 28.8], [76.5, 28.0], [77.5, 27.5], [76.5, 24.5], [73.5, 24.5], [71.0, 25.5], [70.0, 27.5]
    ]
  },
  {
    name: "Gujarat",
    slug: "gujarat",
    code: "GJ",
    capital: "Gandhinagar",
    type: "state",
    coords: [
      [68.5, 23.5], [71.0, 24.5], [73.2, 24.2], [74.0, 22.0], [73.0, 20.5], [71.0, 20.8], [69.0, 22.2], [68.5, 23.5]
    ]
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    slug: "dadra-and-nagar-haveli-and-daman-and-diu",
    code: "DN",
    capital: "Daman",
    type: "ut",
    coords: [
      [72.8, 20.4], [73.1, 20.4], [73.1, 20.1], [72.8, 20.1], [72.8, 20.4]
    ]
  },
  {
    name: "Madhya Pradesh",
    slug: "madhya-pradesh",
    code: "MP",
    capital: "Bhopal",
    type: "state",
    coords: [
      [74.0, 22.0], [75.5, 25.0], [78.0, 26.5], [82.5, 24.5], [82.0, 21.8], [78.5, 21.4], [74.5, 21.5], [74.0, 22.0]
    ]
  },
  {
    name: "Maharashtra",
    slug: "maharashtra",
    code: "MH",
    capital: "Mumbai",
    type: "state",
    coords: [
      [72.8, 19.0], [73.0, 21.0], [77.0, 21.5], [80.5, 21.2], [80.0, 18.5], [76.0, 17.5], [73.8, 15.8], [73.0, 17.0], [72.8, 19.0]
    ]
  },
  {
    name: "Goa",
    slug: "goa",
    code: "GA",
    capital: "Panaji",
    type: "state",
    coords: [
      [73.7, 15.8], [74.3, 15.8], [74.3, 14.9], [73.7, 14.9], [73.7, 15.8]
    ]
  },

  // --- SOUTH ---
  {
    name: "Karnataka",
    slug: "karnataka",
    code: "KA",
    capital: "Bengaluru",
    type: "state",
    coords: [
      [74.1, 15.0], [75.5, 17.5], [77.5, 18.2], [77.8, 15.0], [78.5, 13.5], [76.8, 11.8], [74.8, 12.8], [74.1, 15.0]
    ]
  },
  {
    name: "Kerala",
    slug: "kerala",
    code: "KL",
    capital: "Thiruvananthapuram",
    type: "state",
    coords: [
      [74.8, 12.8], [76.0, 12.0], [76.8, 10.5], [77.2, 8.5], [76.5, 8.8], [75.5, 11.2], [74.8, 12.8]
    ]
  },
  {
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    code: "TN",
    capital: "Chennai",
    type: "state",
    coords: [
      [76.8, 11.8], [78.5, 13.5], [80.3, 13.2], [79.8, 10.5], [78.2, 9.0], [77.5, 8.1], [77.2, 8.5], [76.8, 11.8]
    ]
  },
  {
    name: "Puducherry",
    slug: "puducherry",
    code: "PY",
    capital: "Puducherry",
    type: "ut",
    coords: [
      [79.8, 11.95], [80.0, 11.95], [80.0, 11.85], [79.8, 11.85], [79.8, 11.95]
    ]
  },
  {
    name: "Andhra Pradesh",
    slug: "andhra-pradesh",
    code: "AP",
    capital: "Amaravati",
    type: "state",
    coords: [
      [77.8, 15.0], [79.5, 16.5], [82.5, 18.0], [84.2, 19.0], [82.8, 16.5], [80.2, 14.0], [79.5, 13.0], [77.8, 15.0]
    ]
  },
  {
    name: "Telangana",
    slug: "telangana",
    code: "TG",
    capital: "Hyderabad",
    type: "state",
    coords: [
      [77.5, 18.2], [79.5, 19.8], [80.8, 18.5], [80.5, 16.8], [78.5, 16.0], [77.5, 17.0], [77.5, 18.2]
    ]
  },

  // --- EAST & CENTRAL ---
  {
    name: "Chhattisgarh",
    slug: "chhattisgarh",
    code: "CG",
    capital: "Raipur",
    type: "state",
    coords: [
      [80.5, 21.2], [82.0, 23.5], [83.8, 23.0], [83.2, 19.8], [81.2, 17.8], [80.5, 19.5], [80.5, 21.2]
    ]
  },
  {
    name: "Odisha",
    slug: "odisha",
    code: "OD",
    capital: "Bhubaneswar",
    type: "state",
    coords: [
      [83.2, 19.8], [84.2, 22.0], [87.0, 22.0], [86.8, 20.0], [85.0, 19.2], [84.2, 19.0], [83.2, 19.8]
    ]
  },
  {
    name: "Uttar Pradesh",
    slug: "uttar-pradesh",
    code: "UP",
    capital: "Lucknow",
    type: "state",
    coords: [
      [77.3, 29.5], [79.5, 29.0], [82.5, 28.0], [84.5, 27.0], [84.2, 25.0], [82.5, 24.5], [78.5, 25.5], [77.4, 28.2], [77.3, 29.5]
    ]
  },
  {
    name: "Bihar",
    slug: "bihar",
    code: "BR",
    capital: "Patna",
    type: "state",
    coords: [
      [84.0, 27.5], [88.0, 26.5], [87.5, 24.8], [84.2, 24.5], [84.0, 27.5]
    ]
  },
  {
    name: "Jharkhand",
    slug: "jharkhand",
    code: "JH",
    capital: "Ranchi",
    type: "state",
    coords: [
      [84.2, 24.5], [87.5, 24.8], [86.8, 22.5], [84.5, 22.2], [84.2, 24.5]
    ]
  },
  {
    name: "West Bengal",
    slug: "west-bengal",
    code: "WB",
    capital: "Kolkata",
    type: "state",
    coords: [
      [87.5, 26.8], [89.8, 26.5], [88.5, 23.5], [88.8, 21.6], [87.2, 21.8], [86.5, 24.0], [87.5, 26.8]
    ]
  },

  // --- NORTHEAST ---
  {
    name: "Sikkim",
    slug: "sikkim",
    code: "SK",
    capital: "Gangtok",
    type: "state",
    coords: [
      [88.1, 28.0], [88.9, 28.0], [88.8, 27.2], [88.1, 27.2], [88.1, 28.0]
    ]
  },
  {
    name: "Assam",
    slug: "assam",
    code: "AS",
    capital: "Dispur",
    type: "state",
    coords: [
      [90.0, 26.0], [92.0, 26.8], [95.0, 27.8], [95.5, 27.0], [93.5, 25.5], [92.5, 24.8], [90.5, 25.5], [90.0, 26.0]
    ]
  },
  {
    name: "Arunachal Pradesh",
    slug: "arunachal-pradesh",
    code: "AR",
    capital: "Itanagar",
    type: "state",
    coords: [
      [92.0, 27.8], [94.5, 28.8], [97.2, 28.5], [96.5, 27.2], [93.8, 27.0], [92.0, 27.8]
    ]
  },
  {
    name: "Meghalaya",
    slug: "meghalaya",
    code: "ML",
    capital: "Shillong",
    type: "state",
    coords: [
      [90.0, 25.5], [92.5, 25.5], [92.5, 25.0], [90.0, 25.0], [90.0, 25.5]
    ]
  },
  {
    name: "Nagaland",
    slug: "nagaland",
    code: "NL",
    capital: "Kohima",
    type: "state",
    coords: [
      [93.5, 26.5], [95.0, 27.0], [95.2, 25.8], [93.8, 25.5], [93.5, 26.5]
    ]
  },
  {
    name: "Manipur",
    slug: "manipur",
    code: "MN",
    capital: "Imphal",
    type: "state",
    coords: [
      [93.3, 25.5], [94.6, 25.5], [94.4, 23.8], [93.1, 24.0], [93.3, 25.5]
    ]
  },
  {
    name: "Mizoram",
    slug: "mizoram",
    code: "MZ",
    capital: "Aizawl",
    type: "state",
    coords: [
      [92.3, 24.2], [93.4, 24.0], [93.2, 22.0], [92.5, 22.0], [92.3, 24.2]
    ]
  },
  {
    name: "Tripura",
    slug: "tripura",
    code: "TR",
    capital: "Agartala",
    type: "state",
    coords: [
      [91.2, 24.2], [92.3, 24.2], [92.1, 23.0], [91.3, 23.2], [91.2, 24.2]
    ]
  },

  // --- ISLANDS ---
  {
    name: "Andaman and Nicobar Islands",
    slug: "andaman-and-nicobar-islands",
    code: "AN",
    capital: "Port Blair",
    type: "ut",
    coords: [
      [92.6, 13.5], [93.2, 13.5], [93.2, 11.5], [92.6, 11.5], [92.6, 13.5]
    ]
  },
  {
    name: "Lakshadweep",
    slug: "lakshadweep",
    code: "LD",
    capital: "Kavaratti",
    type: "ut",
    coords: [
      [72.5, 11.0], [73.2, 11.0], [73.2, 10.2], [72.5, 10.2], [72.5, 11.0]
    ]
  }
];

const geojson = {
  type: "FeatureCollection",
  features: states.map((s) => ({
    type: "Feature",
    properties: {
      name: s.name,
      slug: s.slug,
      code: s.code,
      capital: s.capital,
      type: s.type
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: [[s.coords]]
    }
  }))
};

const outputDir = path.resolve(__dirname, '../public/geojson');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'india-states.json'),
  JSON.stringify(geojson, null, 2),
  'utf-8'
);

console.log(`Successfully generated GeoJSON with ${geojson.features.length} states and union territories.`);
