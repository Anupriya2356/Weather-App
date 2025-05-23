// Weather App JavaScript
const myAPI="306a9a3c764b8f867ae5ad6720b42728";
class WeatherApp {
    constructor() {
        this.currentUnit = 'celsius';
        this.currentWeatherData = null;
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.updateDateTime();
        this.loadDefaultWeather();
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    bindEvents() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Temperature unit conversion
        const celsiusBtn = document.getElementById('celsiusBtn');
        const fahrenheitBtn = document.getElementById('fahrenheitBtn');
        
        celsiusBtn.addEventListener('click', () => this.switchUnit('celsius'));
        fahrenheitBtn.addEventListener('click', () => this.switchUnit('fahrenheit'));

        // Error modal close
        const errorClose = document.getElementById('errorClose');
        errorClose.addEventListener('click', () => this.hideError());
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const dateStr = now.toLocaleDateString('en-US', options);
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('currentTime').textContent = timeStr;
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const city = searchInput.value.trim();
        
        if (city) {
            this.searchWeather(city);
            searchInput.value = '';
        }
    }

    async searchWeather(city) {
        this.showLoading();
        
        // Simulate API call with mock data
        setTimeout(() => {
            const mockWeatherData = this.generateMockWeatherData(city);
            this.displayWeatherData(mockWeatherData);
            this.hideLoading();
        }, 1500);
    }

    loadDefaultWeather() {
        // Load default weather data
        const defaultData = this.generateMockWeatherData('New York');
        this.displayWeatherData(defaultData);
    }

    generateMockWeatherData(city) {
        const weatherConditions = [
            { main: 'Sunny', desc: 'Clear sky with bright sunshine', icon: 'fas fa-sun', temp: 24 },
            { main: 'Cloudy', desc: 'Partly cloudy with some sunshine', icon: 'fas fa-cloud-sun', temp: 20 },
            { main: 'Rainy', desc: 'Light rain showers expected', icon: 'fas fa-cloud-rain', temp: 16 },
            { main: 'Overcast', desc: 'Cloudy skies throughout the day', icon: 'fas fa-cloud', temp: 18 }
        ];
        
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        return {
            city: city,
            country: 'US',
            temperature: randomCondition.temp,
            feelsLike: randomCondition.temp + 2,
            condition: randomCondition.main,
            description: randomCondition.desc,
            icon: randomCondition.icon,
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            pressure: Math.floor(Math.random() * 50) + 1000,
            visibility: Math.floor(Math.random() * 15) + 5,
            uvIndex: Math.floor(Math.random() * 10) + 1,
            forecast: this.generateForecastData(),
            hourly: this.generateHourlyData()
        };
    }

    generateForecastData() {
        const days = ['Today', 'Sat', 'Sun', 'Mon', 'Tue'];
        const conditions = [
            { icon: 'fas fa-sun', desc: 'Sunny' },
            { icon: 'fas fa-cloud-sun', desc: 'Partly Cloudy' },
            { icon: 'fas fa-cloud-rain', desc: 'Light Rain' },
            { icon: 'fas fa-cloud', desc: 'Cloudy' }
        ];
        
        return days.map(day => {
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            return {
                day,
                icon: condition.icon,
                high: Math.floor(Math.random() * 10) + 20,
                low: Math.floor(Math.random() * 10) + 10,
                description: condition.desc
            };
        });
    }

    generateHourlyData() {
        const hours = ['Now', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
        const icons = ['fas fa-sun', 'fas fa-cloud-sun', 'fas fa-cloud'];
        
        return hours.map(hour => ({
            hour,
            icon: icons[Math.floor(Math.random() * icons.length)],
            temp: Math.floor(Math.random() * 10) + 18
        }));
    }

    displayWeatherData(data) {
        this.currentWeatherData = data;
        
        // Update main weather info
        document.getElementById('cityName').textContent = data.city;
        document.getElementById('countryName').textContent = data.country;
        document.getElementById('tempValue').textContent = `${data.temperature}°`;
        document.getElementById('weatherIcon').className = data.icon;
        document.getElementById('weatherMain').textContent = data.condition;
        document.getElementById('weatherDesc').textContent = data.description;
        
        // Update weather details
        document.getElementById('humidity').textContent = `${data.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.windSpeed} km/h`;
        document.getElementById('pressure').textContent = `${data.pressure} hPa`;
        document.getElementById('visibility').textContent = `${data.visibility} km`;
        document.getElementById('feelsLike').textContent = `${data.feelsLike}°${this.currentUnit === 'celsius' ? 'C' : 'F'}`;
        document.getElementById('uvIndex').textContent = `${data.uvIndex} (${this.getUVLevel(data.uvIndex)})`;
        
        // Update forecast
        this.displayForecast(data.forecast);
        
        // Update hourly forecast
        this.displayHourlyForecast(data.hourly);
        
        // Show weather sections with animation
        this.showWeatherSections();
    }

    displayForecast(forecastData) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';
        
        forecastData.forEach((day, index) => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-icon"><i class="${day.icon}"></i></div>
                <div class="forecast-temps">
                    <span class="high">${day.high}°</span>
                    <span class="low">${day.low}°</span>
                </div>
                <div class="forecast-desc">${day.description}</div>
            `;
            
            container.appendChild(card);
        });
    }

    displayHourlyForecast(hourlyData) {
        const container = document.getElementById('hourlyContainer');
        container.innerHTML = '';
        
        hourlyData.forEach((hour, index) => {
            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="hour">${hour.hour}</div>
                <div class="hourly-icon"><i class="${hour.icon}"></i></div>
                <div class="hourly-temp">${hour.temp}°</div>
            `;
            
            container.appendChild(card);
        });
    }

    switchUnit(unit) {
        if (this.currentUnit === unit || !this.currentWeatherData) return;
        
        this.currentUnit = unit;
        
        // Update button states
        const celsiusBtn = document.getElementById('celsiusBtn');
        const fahrenheitBtn = document.getElementById('fahrenheitBtn');
        
        celsiusBtn.classList.toggle('active', unit === 'celsius');
        fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
        
        // Convert temperatures
        const tempValue = document.getElementById('tempValue');
        const feelsLike = document.getElementById('feelsLike');
        
        let currentTemp = parseInt(tempValue.textContent);
        let currentFeelsLike = parseInt(feelsLike.textContent);
        
        if (unit === 'fahrenheit') {
            currentTemp = Math.round((currentTemp * 9/5) + 32);
            currentFeelsLike = Math.round((currentFeelsLike * 9/5) + 32);
        } else {
            currentTemp = Math.round((currentTemp - 32) * 5/9);
            currentFeelsLike = Math.round((currentFeelsLike - 32) * 5/9);
        }
        
        tempValue.textContent = `${currentTemp}°`;
        feelsLike.textContent = `${currentFeelsLike}°${unit === 'celsius' ? 'C' : 'F'}`;
        
        // Update forecast temperatures
        this.updateForecastTemperatures(unit);
        this.updateHourlyTemperatures(unit);
    }

    updateForecastTemperatures(unit) {
        const forecastCards = document.querySelectorAll('.forecast-card');
        
        forecastCards.forEach(card => {
            const highTemp = card.querySelector('.high');
            const lowTemp = card.querySelector('.low');
            
            let high = parseInt(highTemp.textContent);
            let low = parseInt(lowTemp.textContent);
            
            if (unit === 'fahrenheit') {
                high = Math.round((high * 9/5) + 32);
                low = Math.round((low * 9/5) + 32);
            } else {
                high = Math.round((high - 32) * 5/9);
                low = Math.round((low - 32) * 5/9);
            }
            
            highTemp.textContent = `${high}°`;
            lowTemp.textContent = `${low}°`;
        });
    }

    updateHourlyTemperatures(unit) {
        const hourlyCards = document.querySelectorAll('.hourly-card');
        
        hourlyCards.forEach(card => {
            const tempElement = card.querySelector('.hourly-temp');
            let temp = parseInt(tempElement.textContent);
            
            if (unit === 'fahrenheit') {
                temp = Math.round((temp * 9/5) + 32);
            } else {
                temp = Math.round((temp - 32) * 5/9);
            }
            
            tempElement.textContent = `${temp}°`;
        });
    }

    getUVLevel(uvIndex) {
        if (uvIndex <= 2) return 'Low';
        if (uvIndex <= 5) return 'Moderate';
        if (uvIndex <= 7) return 'High';
        if (uvIndex <= 10) return 'Very High';
        return 'Extreme';
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const currentWeather = document.getElementById('currentWeather');
        const weatherDetails = document.getElementById('weatherDetails');
        
        spinner.classList.add('show');
        currentWeather.style.opacity = '0.5';
        weatherDetails.style.opacity = '0.5';
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.remove('show');
    }

    showWeatherSections() {
        const currentWeather = document.getElementById('currentWeather');
        const weatherDetails = document.getElementById('weatherDetails');
        const forecastSection = document.querySelector('.forecast-section');
        const hourlySection = document.querySelector('.hourly-section');
        
        // Reset and show current weather
        currentWeather.style.opacity = '';
        currentWeather.classList.add('show');
        
        // Show weather details with delay
        setTimeout(() => {
            weatherDetails.style.opacity = '';
            weatherDetails.classList.add('show');
        }, 200);
        
        // Show forecast sections with delay
        setTimeout(() => {
            forecastSection.classList.add('show');
        }, 400);
        
        setTimeout(() => {
            hourlySection.classList.add('show');
        }, 600);
    }

    showError(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorModal.classList.add('show');
        
        this.hideLoading();
    }

    hideError() {
        const errorModal = document.getElementById('errorModal');
        errorModal.classList.remove('show');
    }

    // Weather background animation
    createWeatherAnimation(condition) {
        const weatherApp = document.querySelector('.weather-app');
        
        // Remove existing animations
        const existingAnimations = weatherApp.querySelectorAll('.weather-animation');
        existingAnimations.forEach(animation => animation.remove());
        
        if (condition === 'Rainy') {
            this.createRainAnimation();
        } else if (condition === 'Sunny') {
            this.createSunAnimation();
        }
    }

    createRainAnimation() {
        const weatherApp = document.querySelector('.weather-app');
        
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'weather-animation rain-drop';
            drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: 10px;
                background: rgba(116, 185, 255, 0.6);
                left: ${Math.random() * 100}%;
                animation: rain 1s linear infinite;
                animation-delay: ${Math.random() * 1}s;
                z-index: 1;
            `;
            
            weatherApp.appendChild(drop);
        }
        
        // Add rain animation keyframes
        if (!document.getElementById('rainAnimation')) {
            const style = document.createElement('style');
            style.id = 'rainAnimation';
            style.textContent = `
                @keyframes rain {
                    0% { transform: translateY(-100vh); opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createSunAnimation() {
        const weatherApp = document.querySelector('.weather-app');
        
        const sunRays = document.createElement('div');
        sunRays.className = 'weather-animation sun-rays';
        sunRays.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(253, 203, 110, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: rotate 20s linear infinite;
            z-index: 1;
        `;
        
        weatherApp.appendChild(sunRays);
        
        // Add sun animation keyframes
        if (!document.getElementById('sunAnimation')) {
            const style = document.createElement('style');
            style.id = 'sunAnimation';
            style.textContent = `
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Geolocation functionality
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    reject(new Error('Unable to retrieve your location.'));
                }
            );
        });
    }

    // Local storage for favorite cities
    saveFavoriteCity(city) {
        let favorites = this.getFavoriteCities();
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        }
    }

    getFavoriteCities() {
        const favorites = localStorage.getItem('favoriteCities');
        return favorites ? JSON.parse(favorites) : [];
    }

    removeFavoriteCity(city) {
        let favorites = this.getFavoriteCities();
        favorites = favorites.filter(fav => fav !== city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
}

// Initialize the weather app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some utility functions
const WeatherUtils = {
    // Convert wind direction degrees to compass direction
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    },

    // Format large numbers (e.g., visibility)
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    },

    // Get weather emoji based on condition
    getWeatherEmoji(condition) {
        const emojiMap = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'stormy': '⛈️',
            'snowy': '❄️',
            'foggy': '🌫️'
        };
        return emojiMap[condition.toLowerCase()] || '🌤️';
    },

    // Calculate heat index
    calculateHeatIndex(temperature, humidity) {
        if (temperature < 80) return temperature;
        
        const T = temperature;
        const RH = humidity;
        
        let HI = -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH;
        HI += -0.00683783 * T * T - 0.05481717 * RH * RH + 0.00122874 * T * T * RH;
        HI += 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;
        
        return Math.round(HI);
    }
};
