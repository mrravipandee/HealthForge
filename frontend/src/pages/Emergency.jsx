import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getStates, getDistricts, getCities, getCityCoordinates } from "../data/indiaLocationData";

const Emergency = () => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        cause: "",
        mobile: "",
        witnessMobile: "",
        state: "",
        district: "",
        city: "",
        location: { lat: null, lng: null }
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [locationSelected, setLocationSelected] = useState(false);

    // Load Google Maps API
    useEffect(() => {
        const loadGoogleMaps = () => {
            if (window.google && window.google.maps) {
                setMapLoaded(true);
                return;
            }

            const existingScript = document.getElementById("googleMapsScript");
            if (existingScript) return;

            const script = document.createElement("script");
            script.id = "googleMapsScript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                }&libraries=places`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                if (window.google && window.google.maps) {
                    setMapLoaded(true);
                } else {
                    console.error("Google Maps failed to load.");
                }
            };

            document.head.appendChild(script);
        };

        loadGoogleMaps();
    }, []);

    // Initialize map when API is loaded
    useEffect(() => {
        if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 20.5937, lng: 78.9629 },
                zoom: 5,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                styles: [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#444444" }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{ "color": "#f2f2f2" }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{ "visibility": "simplified" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{ "color": "#d4e6f4" }, { "visibility": "on" }]
                    }
                ]
            });

            mapInstanceRef.current = map;

            // Add click listener to place marker
            map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                setFormData(prev => ({
                    ...prev,
                    location: { lat, lng }
                }));

                setLocationSelected(true);

                // Update marker
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }

                markerRef.current = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    title: 'Emergency Location',
                    animation: window.google.maps.Animation.DROP,
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="white" stroke-width="2"/>
                                <path d="M12 8v4l2 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="2" fill="white"/>
                            </svg>
                        `),
                        scaledSize: new window.google.maps.Size(32, 32),
                        anchor: new window.google.maps.Point(16, 32)
                    }
                });

                // Add info window
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div class="p-2">
                            <h3 class="font-semibold text-[#193378] ">Emergency Location</h3>
                            <p class="text-sm">Lat: ${lat.toFixed(6)}</p>
                            <p class="text-sm">Lng: ${lng.toFixed(6)}</p>
                        </div>
                    `
                });

                infoWindow.open(map, markerRef.current);

                setTimeout(() => {
                    infoWindow.close();
                }, 3000);
            });

            // Initialize Places Autocomplete
            const input = document.getElementById('search-input');
            if (input) {
                const autocomplete = new window.google.maps.places.Autocomplete(input, {
                    types: ['geocode', 'establishment'],
                    componentRestrictions: { country: 'IN' }
                });

                // Listen for place selection
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();

                    if (!place.geometry || !place.geometry.location) {
                        toast.error('No location found for this address');
                        return;
                    }

                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    // Update form data
                    setFormData(prev => ({
                        ...prev,
                        location: { lat, lng }
                    }));

                    setLocationSelected(true);

                    // Update marker
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }

                    markerRef.current = new window.google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        title: place.name || 'Emergency Location',
                        animation: window.google.maps.Animation.DROP,
                        icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="white" stroke-width="2"/>
                                    <path d="M12 8v4l2 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <circle cx="12" cy="12" r="2" fill="white"/>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });

                    // Center map on the selected location
                    map.setCenter({ lat, lng });
                    map.setZoom(15);

                    toast.success(`Location set to: ${place.name || place.formatted_address}`);
                });
            }
        }
    }, [mapLoaded]);

    // Update map when city changes
    useEffect(() => {
        if (mapInstanceRef.current && formData.city) {
            const coordinates = getCityCoordinates(formData.city);
            if (coordinates) {
                mapInstanceRef.current.setCenter(coordinates);
                mapInstanceRef.current.setZoom(12);
            }
        }
    }, [formData.city]);

    // Handle state change
    const handleStateChange = (e) => {
        const state = e.target.value;
        setFormData(prev => ({
            ...prev,
            state,
            district: "",
            city: "",
            location: { lat: null, lng: null }
        }));
        setDistricts(getDistricts(state));
        setCities([]);
        setLocationSelected(false);
    };

    // Handle district change
    const handleDistrictChange = (e) => {
        const district = e.target.value;
        setFormData(prev => ({
            ...prev,
            district,
            city: "",
            location: { lat: null, lng: null }
        }));
        setCities(getCities(formData.state, district));
        setLocationSelected(false);
    };

    // Handle city change
    const handleCityChange = (e) => {
        const city = e.target.value;
        setFormData(prev => ({
            ...prev,
            city,
            location: { lat: null, lng: null }
        }));
        setLocationSelected(false);
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.gender || !formData.cause || !formData.mobile ||
            !formData.witnessMobile || !formData.state || !formData.district || !formData.city) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!formData.location.lat || !formData.location.lng) {
            toast.error("Please select a location on the map");
            return;
        }

        // Mobile number validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile) || !mobileRegex.test(formData.witnessMobile)) {
            toast.error("Please enter valid 10-digit mobile numbers");
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Add form data
            Object.keys(formData).forEach(key => {
                if (key === 'location') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add image if selected
            if (image) {
                formDataToSend.append('image', image);
            }

            console.log('Sending emergency data:', {
                ...formData,
                location: JSON.stringify(formData.location),
                image: image ? 'Image attached' : 'No image'
            });

            const response = await axios.post('http://localhost:3000/api/emergency', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/emergency-submitted');
            } else {
                toast.error(response.data.message || 'Failed to report emergency');
            }
        } catch (error) {
            console.error('Emergency submission error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Progress steps
    const steps = [
        { number: 1, title: "Patient Details" },
        { number: 2, title: "Location" },
        { number: 3, title: "Review & Submit" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 rounded-lg py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-[#193378]/30 rounded-full mb-4">
                        <svg className="w-12 h-12 text-[#193378]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#193378] mb-4">
                        Emergency <span className="text-[#193378]/80">Report</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Report an emergency and we'll dispatch the nearest ambulance immediately.
                        Please provide accurate information to ensure quick response.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'w-40' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.number ? 'bg-[#193378] border-[#193378] text-white' : 'border-gray-300 text-gray-500'}`}>
                                        {step.number}
                                    </div>
                                    <span className="text-xs mt-2 text-gray-600 hidden sm:block">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-[#193378]' : 'bg-gray-200'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Form Fields */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Emergency Details</h2>

                                {/* Patient Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Patient Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                            placeholder="Enter patient name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender *
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Cause of Emergency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cause of Emergency *
                                    </label>
                                    <textarea
                                        name="cause"
                                        value={formData.cause}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                        placeholder="Describe the emergency situation..."
                                        required
                                    />
                                </div>

                                {/* Mobile Numbers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Patient Mobile *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                                placeholder="10-digit mobile number"
                                                maxLength="10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Witness Mobile *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="witnessMobile"
                                                value={formData.witnessMobile}
                                                onChange={handleChange}
                                                className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                                placeholder="10-digit mobile number"
                                                maxLength="10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Emergency Image (Optional)
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg border" />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-[#193378] text-white p-1 rounded-full"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#193378] transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Location Dropdowns */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {getStates().map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District *
                                        </label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleDistrictChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                            required
                                            disabled={!formData.state}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleCityChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                            required
                                            disabled={!formData.district}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !locationSelected}
                                    className="w-full bg-gradient-to-r from-[#193378] to-[#193378]/80 text-white py-4 px-6 rounded-lg font-semibold hover:from-[#193378]/80 hover:to-[#193378] focus:outline-none focus:ring-2 focus:ring-[#193378] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Reporting Emergency...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            Report Emergency
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Right Column - Map */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Select Emergency Location</h2>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    {/* Search Bar */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🔍 Search for Address (Optional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="search-input"
                                                type="text"
                                                placeholder="Search for address, landmark, or location..."
                                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent transition-colors"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoComplete="off"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Type an address and select from suggestions, or click on the map to set location manually
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">
                                        📍 Click on the map to mark the exact emergency location.
                                        The map will center on your selected city.
                                    </p>

                                    {formData.location.lat && formData.location.lng && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-green-800 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Location selected: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        ref={mapRef}
                                        className="w-full h-96 rounded-lg border-2 border-gray-300 shadow-inner"
                                        style={{ minHeight: '400px' }}
                                    >
                                        {!mapLoaded && (
                                            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#193378] mx-auto mb-2"></div>
                                                    <p className="text-gray-600">Loading map...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Emergency Instructions */}
                                <div className="bg-[#193378]/10 border border-[#193378]/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-[#193378] mb-2 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Emergency Instructions:
                                    </h3>
                                    <ul className="text-sm text-[#193378] space-y-1">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Stay calm and provide accurate information</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Keep the patient comfortable and safe</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Do not move the patient if injured</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Clear the area for ambulance access</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Keep your phone accessible for updates</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Emergency;