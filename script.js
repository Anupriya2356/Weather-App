// API Configuration
const API_KEY = '306a9a3c764b8f867ae5ad6720b42728';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weatherInfo');

// Weather data elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize app
window.addEventListener('load', initializeApp);

async function initializeApp() {
    console.log('🌤️ Weather Hub initialized');
    
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.log('Geolocation error:', error);
                // Fallback to popular city
                fetchWeather('Mumbai');
            }
        );
    } else {
        fetchWeather('Mumbai');
    }
}

async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name to search! 🏙️');
        return;
    }
    
    await fetchWeather(city);
}

async function fetchWeather(city) {
    try {
        showLoading();
        hideError();
        hideWeatherInfo();
        
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`City "${city}" not found`);
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (err) {
        console.error('Weather fetch error:', err);
        showError(`Sorry, couldn't find weather for "${city}". Please check the spelling! 🔍`);
    } finally {
        hideLoading();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        showLoading();
        hideError();
        hideWeatherInfo();
        
        const response = await fetch(
            `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not available for your location');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (err) {
        console.error('Location weather error:', err);
        showError('Unable to fetch weather for your location 📍');
        // Fallback to Mumbai
        setTimeout(() => fetchWeather('Mumbai'), 2000);
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    console.log('Weather data:', data);
    
    // Update location info
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update date
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Update temperature and description
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    
    // Update weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind?.speed || 0} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Clear search input
    cityInput.value = '';
    
    // Show weather info with animation
    showWeatherInfo();
    
    // Add some celebration for successful search
    console.log(`🎉 Weather loaded for ${data.name}!`);
}

// UI State Management
function showLoading() {
    loading.style.display = 'block';
    error.style.display = 'none';
    weatherInfo.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    const errorMessage = error.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    error.style.display = 'block';
    weatherInfo.style.display = 'none';
    
    // Auto hide error after 5 seconds
    setTimeout(hideError, 5000);
}

function hideError() {
    error.style.display = 'none';
}

function showWeatherInfo() {
    weatherInfo.style.display = 'block';
    error.style.display = 'none';
}

function hideWeatherInfo() {
    weatherInfo.style.display = 'none';
}

// Add some fun console messages
console.log(`
🌤️ Weather Hub - Beautiful Weather App
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Features:
   • Real-time weather data
   • Beautiful glassmorphism UI
   • Auto location detection
   • Smooth animations
   • Responsive design

🔑 API: OpenWeatherMap
📱 Made with love for weather enthusiasts!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);