// Indian States, Districts, and Cities Data
export const indiaLocationData = {
    "Maharashtra": {
        "Mumbai": ["Mumbai", "Thane", "Navi Mumbai", "Mira-Bhayandar", "Kalyan-Dombivli"],
        "Pune": ["Pune", "Pimpri-Chinchwad", "Solapur", "Kolhapur", "Sangli"],
        "Nagpur": ["Nagpur", "Amravati", "Akola", "Wardha", "Chandrapur"],
        "Aurangabad": ["Aurangabad", "Jalna", "Beed", "Osmanabad", "Latur"],
        "Nashik": ["Nashik", "Malegaon", "Dhule", "Jalgaon", "Ahmednagar"]
    },
    "Delhi": {
        "New Delhi": ["New Delhi", "Old Delhi", "Dwarka", "Rohini", "Pitampura"],
        "North Delhi": ["North Delhi", "Shahdara", "Seelampur", "Timarpur", "Civil Lines"],
        "South Delhi": ["South Delhi", "Hauz Khas", "Saket", "Vasant Vihar", "Greater Kailash"],
        "East Delhi": ["East Delhi", "Preet Vihar", "Mayur Vihar", "Pandav Nagar", "Laxmi Nagar"],
        "West Delhi": ["West Delhi", "Rajouri Garden", "Janakpuri", "Vikaspuri", "Uttam Nagar"]
    },
    "Karnataka": {
        "Bangalore": ["Bangalore", "Electronic City", "Whitefield", "Marathahalli", "Hebbal"],
        "Mysore": ["Mysore", "Mandya", "Chamarajanagar", "Hassan", "Tumkur"],
        "Mangalore": ["Mangalore", "Udupi", "Kundapura", "Karkala", "Bantwal"],
        "Hubli": ["Hubli", "Dharwad", "Belgaum", "Bijapur", "Gulbarga"]
    },
    "Tamil Nadu": {
        "Chennai": ["Chennai", "Tambaram", "Vellore", "Coimbatore", "Madurai"],
        "Coimbatore": ["Coimbatore", "Erode", "Salem", "Tiruppur", "Karur"],
        "Madurai": ["Madurai", "Tiruchirappalli", "Thanjavur", "Kumbakonam", "Sivaganga"]
    },
    "Gujarat": {
        "Ahmedabad": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        "Surat": ["Surat", "Navsari", "Valsad", "Bharuch", "Anand"],
        "Vadodara": ["Vadodara", "Anand", "Nadiad", "Bharuch", "Godhra"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow", "Kanpur", "Varanasi", "Allahabad", "Agra"],
        "Kanpur": ["Kanpur", "Unnao", "Fatehpur", "Etawah", "Farrukhabad"],
        "Varanasi": ["Varanasi", "Mirzapur", "Jaunpur", "Ghazipur", "Chandauli"]
    },
    "West Bengal": {
        "Kolkata": ["Kolkata", "Howrah", "Salt Lake", "New Town", "Barrackpore"],
        "Howrah": ["Howrah", "Hooghly", "Burdwan", "Asansol", "Durgapur"],
        "Siliguri": ["Siliguri", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Alipurduar"]
    },
    "Telangana": {
        "Hyderabad": ["Hyderabad", "Secunderabad", "Warangal", "Karimnagar", "Nizamabad"],
        "Warangal": ["Warangal", "Khammam", "Nalgonda", "Adilabad", "Medak"]
    },
    "Andhra Pradesh": {
        "Visakhapatnam": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
        "Vijayawada": ["Vijayawada", "Guntur", "Ongole", "Eluru", "Machilipatnam"]
    },
    "Kerala": {
        "Thiruvananthapuram": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
        "Kochi": ["Kochi", "Ernakulam", "Alappuzha", "Kottayam", "Idukki"]
    },
    "Rajasthan": {
        "Jaipur": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
        "Jodhpur": ["Jodhpur", "Bikaner", "Jaisalmer", "Barmer", "Pali"],
        "Udaipur": ["Udaipur", "Rajsamand", "Bhilwara", "Chittorgarh", "Dungarpur"]
    },
    "Punjab": {
        "Chandigarh": ["Chandigarh", "Mohali", "Panchkula", "Amritsar", "Ludhiana"],
        "Amritsar": ["Amritsar", "Gurdaspur", "Tarn Taran", "Kapurthala", "Jalandhar"],
        "Ludhiana": ["Ludhiana", "Patiala", "Bathinda", "Moga", "Ferozepur"]
    },
    "Haryana": {
        "Gurgaon": ["Gurgaon", "Faridabad", "Panipat", "Sonipat", "Rohtak"],
        "Faridabad": ["Faridabad", "Palwal", "Nuh", "Rewari", "Mahendragarh"]
    },
    "Madhya Pradesh": {
        "Bhopal": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
        "Indore": ["Indore", "Dewas", "Dhar", "Ratlam", "Mandsaur"],
        "Jabalpur": ["Jabalpur", "Katni", "Narsinghpur", "Chhindwara", "Seoni"]
    },
    "Bihar": {
        "Patna": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
        "Gaya": ["Gaya", "Nawada", "Aurangabad", "Jehanabad", "Arwal"]
    },
    "Odisha": {
        "Bhubaneswar": ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur"],
        "Cuttack": ["Cuttack", "Jagatsinghpur", "Kendrapara", "Jajpur", "Bhadrak"]
    },
    "Assam": {
        "Guwahati": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tinsukia"],
        "Dibrugarh": ["Dibrugarh", "Tinsukia", "Sivasagar", "Jorhat", "Golaghat"]
    }
};

// Get all states
export const getStates = () => Object.keys(indiaLocationData);

// Get districts for a state
export const getDistricts = (state) => {
    if (!state || !indiaLocationData[state]) return [];
    return Object.keys(indiaLocationData[state]);
};

// Get cities for a state and district
export const getCities = (state, district) => {
    if (!state || !district || !indiaLocationData[state] || !indiaLocationData[state][district]) return [];
    return indiaLocationData[state][district];
};

// Get coordinates for major cities (approximate)
export const cityCoordinates = {
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Delhi": { lat: 28.7041, lng: 77.1025 },
    "Bangalore": { lat: 12.9716, lng: 77.5946 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "Lucknow": { lat: 26.8467, lng: 80.9462 },
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
    "Thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
    "Jaipur": { lat: 26.9124, lng: 75.7873 },
    "Chandigarh": { lat: 30.7333, lng: 76.7794 },
    "Gurgaon": { lat: 28.4595, lng: 77.0266 },
    "Bhopal": { lat: 23.2599, lng: 77.4126 },
    "Patna": { lat: 25.5941, lng: 85.1376 },
    "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
    "Guwahati": { lat: 26.1445, lng: 91.7362 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
    "Nagpur": { lat: 21.1458, lng: 79.0882 },
    "Surat": { lat: 21.1702, lng: 72.8311 },
    "Vadodara": { lat: 22.3072, lng: 73.1812 },
    "Kanpur": { lat: 26.4499, lng: 80.3319 },
    "Varanasi": { lat: 25.3176, lng: 82.9739 },
    "Howrah": { lat: 22.5958, lng: 88.2636 },
    "Warangal": { lat: 17.9689, lng: 79.5941 },
    "Kochi": { lat: 9.9312, lng: 76.2673 },
    "Jodhpur": { lat: 26.2389, lng: 73.0243 },
    "Amritsar": { lat: 31.6340, lng: 74.8723 },
    "Faridabad": { lat: 28.4089, lng: 77.3178 },
    "Indore": { lat: 22.7196, lng: 75.8577 },
    "Gaya": { lat: 24.7914, lng: 85.0002 },
    "Cuttack": { lat: 20.4625, lng: 85.8830 },
    "Dibrugarh": { lat: 27.4728, lng: 95.0195 }
};

// Get coordinates for a city
export const getCityCoordinates = (city) => {
    return cityCoordinates[city] || null;
};
