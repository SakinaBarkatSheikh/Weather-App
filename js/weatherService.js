class WeatherService {
    constructor(apiBaseUrl) {
        this.baseUrl = apiBaseUrl;
        this.geoUrl = `${apiBaseUrl}/geo`;
    }

    // ========================================
    // GET CURRENT WEATHER BY CITY
    // ========================================

    async getCurrentWeather(city) {
        const url =
            `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=metric`;

        console.log("Weather URL:", url);

        const response = await fetch(url);

        console.log("Weather API Status:", response.status);

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error(
                    "City not found. Please check the city name."
                );
            }

            if (response.status === 401) {
                throw new Error(
                    "Invalid API key."
                );
            }

            throw new Error(
                "Unable to fetch weather data."
            );
        }

        return await response.json();
    }


    // ========================================
    // GET 5-DAY FORECAST BY CITY
    // ========================================

    async getForecast(city) {
        const url =
            `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=metric`;

        console.log("Forecast URL:", url);

        const response = await fetch(url);

        console.log("Forecast API Status:", response.status);

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error(
                    "City not found. Please check the city name."
                );
            }

            if (response.status === 401) {
                throw new Error(
                    "Invalid API key."
                );
            }

            throw new Error(
                "Unable to fetch forecast data."
            );
        }

        return await response.json();
    }


    // ========================================
    // GET CURRENT WEATHER BY LOCATION
    // ========================================

    async getWeatherByCoordinates(latitude, longitude) {

        const url =
            `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric`;

        console.log("Location Weather URL:", url);

        const response = await fetch(url);

        console.log(
            "Location Weather API Status:",
            response.status
        );

        if (!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    "Invalid API key."
                );
            }

            throw new Error(
                "Unable to fetch weather for your location."
            );
        }

        return await response.json();
    }


    // ========================================
    // GET FORECAST BY LOCATION
    // ========================================

    async getForecastByCoordinates(latitude, longitude) {

        const url =
            `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&units=metric`;

        console.log("Location Forecast URL:", url);

        const response = await fetch(url);

        console.log(
            "Location Forecast API Status:",
            response.status
        );

        if (!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    "Invalid API key."
                );
            }

            throw new Error(
                "Unable to fetch location forecast."
            );
        }

        return await response.json();
    }


    // ========================================
    // CITY AUTOCOMPLETE
    // ========================================

    async searchCities(query) {

        if (!query || query.length < 2) {
            return [];
        }

        const url =
            `${this.geoUrl}/direct?q=${encodeURIComponent(query)}&limit=5`;

        console.log("City Search URL:", url);

        try {

            const response = await fetch(url);

            if (!response.ok) {
                return [];
            }

            return await response.json();

        } catch (error) {

            console.error(
                "City search error:",
                error
            );

            return [];
        }
    }


    // ========================================
    // WEATHER ALERTS
    // ========================================

    async getAlerts(latitude, longitude) {
        console.log("Weather alerts are currently unavailable.");
        return [];
    }
}
